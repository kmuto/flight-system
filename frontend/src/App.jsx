import React, { useState } from 'react';

function App() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFlights = async () => {
    setLoading(true);
    try {
      // フロントエンドの初期化コード(instrumentation.js)により、
      // この fetch には自動的に traceparent ヘッダーが付与されます。
      const response = await fetch('http://localhost:8000/api/flights/search');
      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>✈️ 航空券検索システム</h1>
      <button 
        onClick={searchFlights} 
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        disabled={loading}
      >
        {loading ? '検索中...' : '羽田(HND)発の便を検索'}
      </button>

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
