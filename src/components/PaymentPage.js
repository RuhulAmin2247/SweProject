import React, { useState } from 'react';

const SERVER_URL = 'http://10.5.228.3:3000'; // Update this to your backend server

function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Check server status
  const checkServer = async () => {
    setServerStatus('Checking server...');
    try {
      const response = await fetch(`${SERVER_URL}/`);
      const data = await response.json();
      setServerStatus(`✅ ${data.message}`);
    } catch (error) {
      setServerStatus('❌ Server not reachable');
    }
  };

  // Handle payment
  const handlePayment = async () => {
    if (serverStatus.includes('❌')) {
      alert('Please start the backend server first!');
      return;
    }
    setLoading(true);
    try {
      const paymentData = {
        amount: 100,
        name: 'Ruhul Amin',
        email: 'ruhul@example.com',
        phone: '01782315183',
      };
      const response = await fetch(`${SERVER_URL}/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setPaymentUrl(data.paymentUrl);
        setTransactionId(data.transactionId);
      } else {
        alert(data.error || 'Failed to initialize payment');
      }
    } catch (error) {
      alert('Could not connect to payment server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h2>💳 SSLCommerz Payment</h2>
      <div style={{ marginBottom: 20 }}>
        <button onClick={checkServer}>Check Server</button>
        <span style={{ marginLeft: 10 }}>{serverStatus}</span>
      </div>
      <button onClick={handlePayment} disabled={loading || serverStatus.includes('❌')}>
        {loading ? 'Processing...' : 'Pay ৳100 Now'}
      </button>
      {paymentUrl && (
        <div style={{ marginTop: 30 }}>
          <h3>Complete Payment</h3>
          <iframe
            src={paymentUrl}
            title="SSLCommerz Payment"
            width="100%"
            height="500px"
            style={{ border: '1px solid #ccc' }}
          />
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
