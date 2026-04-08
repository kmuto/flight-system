import React, { useState } from 'react';

function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFlights = async () => {
    setLoading(true);
    try {
      // フロントエンドの初期化コード(instrumentation.js)により、
      // この fetch には自動的に traceparent ヘッダーが付与されます。
     const res = await fetch(`/api/flights/search?origin=${origin}&destination=${destination}`);
      const data = await res.json();

      if (res.ok) {
        // paginate() を使っている場合は .data が配列
        setFlights(data.data); 
      } else {
        // エラー時
        alert("Error: " + data.message);
        setFlights([]);
      }
    } catch (error) {
     alert("Something wrong. Try later");
     console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>✈️ 航空券検索システム</h1>

      <div>
        <input 
          placeholder="Origin (e.g. Osaka)" 
          value={origin} 
          onChange={(e) => setOrigin(e.target.value)} 
        />
        <input 
          placeholder="Destination (Tokyo for Error)" 
          value={destination} 
          onChange={(e) => setDestination(e.target.value)}
        />

        <button 
          onClick={searchFlights} 
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
          disabled={loading}
        >
          {loading ? '検索中...' : '検索'}
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        {flights.map(flight => (
          <div key={flight.id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
            <strong>{flight.flight_number}</strong>: {flight.origin} → {flight.destination} 
            <span style={{ marginLeft: '20px', color: 'green' }}>¥{flight.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
