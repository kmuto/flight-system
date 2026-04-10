import React, { useState } from 'react';
import { trace, SpanStatusCode } from '@opentelemetry/api';

function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFlights = async () => {
    const tracer = trace.getTracer('flight-frontend');
    setLoading(true);

    await tracer.startActiveSpan('ui-search-workflow', async (searchSpan) => {
      searchSpan.setAttribute('app.search.origin', origin);
      searchSpan.setAttribute('app.search.destination', destination);

      // フロントエンドのバリデーション用のスパンを開始
      await tracer.startActiveSpan('ui-validation', async (span) => {
        if (origin === '') {
          const errorMsg = "出発地を指定してください";

          // エラーの証拠を残す
          span.recordException(new Error(errorMsg));
          span.setStatus({ code: SpanStatusCode.ERROR, message: errorMsg });
          span.setAttribute('app.validation.fail_reason', 'identical_locations');
          span.end(); // ここでスパンを終了

          searchSpan.setStatus({ code: SpanStatusCode.ERROR, message: errorMsg });
          searchSpan.end();
          setLoading(false);
          return; // 通信（fetch）せずに終了
        }

        // --- 正常な場合のみ fetch を実行 ---
        span.addEvent('Validation passed, starting fetch');
        span.end(); // バリデーションスパンはここで終わり、この後に fetch スパンが続く

        try {
          // フロントエンドの初期化コード(instrumentation.js)により、
          // この fetch には自動的に traceparent ヘッダーが付与される
          const res = await fetch(`/api/flights/search?origin=${origin}&destination=${destination}`);
          const data = await res.json();

          if (res.ok) {
            // paginate() を使っている場合は .data が配列
            setFlights(data.data);
            searchSpan.setStatus({ code: SpanStatusCode.OK });
          } else {
            // エラー時
            alert("Error: " + data.message);
            setFlights([]);
            searchSpan.setStatus({ code: SpanStatusCode.ERROR, message: `http_${res.status}` });
          }
        } catch (error) {
          alert("Something wrong. Try later");
          console.error('Fetch error:', error);
          searchSpan.recordException(error);
          searchSpan.setStatus({ code: SpanStatusCode.ERROR, message: 'network_error' });
        } finally {
          searchSpan.end();
          setLoading(false);
        }
      });
    });
  };

  return (
<div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
    <h1 style={{ textAlign: 'center', color: '#333' }}>✈️ 航空券検索</h1>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontSize: '14px', color: '#666' }}>出発地</label>
        <input 
          placeholder="例: Osaka" 
          value={origin} 
          onChange={(e) => setOrigin(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontSize: '14px', color: '#666' }}>目的地</label>
        <input 
          placeholder="例: Tokyo" 
          value={destination} 
          onChange={(e) => setDestination(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
        />
      </div>

      <button 
        onClick={searchFlights} 
        disabled={loading}
        style={{ 
          padding: '15px', 
          fontSize: '16px', 
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          transition: 'background-color 0.2s'
        }}
      >
        {loading ? '検索中...' : '航空券を探す'}
      </button>
    </div>

    {/* 検索結果エリア */}
    <div style={{ marginTop: '30px' }}>
      {flights.length > 0 && <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>検索結果</h3>}
      {flights.map(flight => (
        <div key={flight.id} style={{ backgroundColor: 'white', margin: '10px 0', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #007bff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>{flight.flight_number}</strong>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>{flight.display_price}</span>
          </div>
          <div style={{ color: '#666', marginTop: '5px' }}>
            {flight.origin} ✈️ {flight.destination}
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default App;
