import React, { useState } from 'react';

function WebhookRequest() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); 

  const sendWebhook = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://32c0da79923d.ngrok-free.app/webhooks/rest/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: 'test_user',
          message: message, 
        }),
      });

      if (!res.ok) {
        throw new Error(`Errore: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <label htmlFor="userMessage">Chat with the Server:</label>
      <br />
      <textarea
        id="userMessage"
        rows={4}
        cols={50}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your sentence..."
      />
      <br />
      <button onClick={sendWebhook} disabled={loading || message.trim() === ''}>
        {loading ? 'Sending...' : 'Send'}
      </button>
      {response && (
  <div>
    <h3>Server Response:</h3>
    <div style={{
  maxHeight: '300px',
  overflowY: 'auto',
  backgroundColor: '#f0f0f0',
  padding: '10px',
  borderRadius: '5px',
  whiteSpace: 'pre-wrap',
  fontFamily: 'monospace',
  maxWidth: '20cm',             
  overflowWrap: 'break-word',
}}>
  {JSON.stringify(response, null, 2)}
    </div>
  </div>
)}

      {error && (
        <div style={{ color: 'red' }}>
          <p>Errore: {error}</p>
        </div>
      )}
    </div>
  );
}

export default WebhookRequest;


