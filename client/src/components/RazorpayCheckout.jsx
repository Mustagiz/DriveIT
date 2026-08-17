import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, CreditCard, Smartphone, Shield } from 'lucide-react';

const API_BASE = 'http://localhost:5050';

// Load Razorpay SDK dynamically
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function RazorpayCheckout({
  amount,           // Final amount in ₹
  rideId,
  bookingRef,
  pilotName,
  origin,
  destination,
  token,
  onSuccess,
  onError
}) {
  const [step, setStep] = useState('idle'); // 'idle' | 'creating' | 'paying' | 'verifying' | 'success' | 'error'
  const [paymentResult, setPaymentResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handlePayment = async () => {
    setStep('creating');

    try {
      // Step 1: Create order on server
      const orderRes = await fetch(`${API_BASE}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rideId, amount, bookingRef, seatsBooked: 1 })
      });

      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error || 'Order creation failed');

      // Demo mode — skip Razorpay checkout
      if (orderData.demo) {
        setStep('verifying');
        await new Promise(r => setTimeout(r, 1500)); // Simulate processing

        const mockPaymentId = `demo_pay_${Date.now()}`;
        const verifyRes = await fetch(`${API_BASE}/api/payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            orderId: orderData.orderId,
            paymentId: mockPaymentId,
            bookingRef,
            rideId,
            amount
          })
        });

        const verifyData = await verifyRes.json();
        if (!verifyData.success) throw new Error('Demo payment verification failed');

        setPaymentResult({ ...verifyData, demo: true });
        setStep('success');
        onSuccess?.({ ...verifyData, demo: true });
        return;
      }

      // Live Razorpay checkout
      setStep('paying');
      const rzpLoaded = await loadRazorpay();
      if (!rzpLoaded) throw new Error('Razorpay SDK failed to load');

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          order_id: orderData.orderId,
          name: 'DriveIT Intercity',
          description: `${origin} → ${destination} | Pilot: ${pilotName}`,
          image: '/driveit-logo.svg',
          prefill: { name: '', email: '', contact: '' },
          theme: { color: '#84CC16' },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled by user'))
          },
          handler: async (response) => {
            try {
              setStep('verifying');
              const verifyRes = await fetch(`${API_BASE}/api/payments/verify`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  orderId: orderData.orderId,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  bookingRef,
                  rideId,
                  amount
                })
              });

              const verifyData = await verifyRes.json();
              if (!verifyData.success) throw new Error('Payment verification failed');

              setPaymentResult(verifyData);
              setStep('success');
              onSuccess?.(verifyData);
              resolve();
            } catch (err) {
              reject(err);
            }
          }
        });

        rzp.open();
      });

    } catch (err) {
      setStep('error');
      setErrorMsg(err.message);
      onError?.(err);
    }
  };

  if (step === 'success' && paymentResult) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.05) 100%)',
        border: '1.5px solid #10B981',
        borderRadius: '16px',
        padding: '24px',
        textAlign: 'center'
      }}>
        <CheckCircle2 size={40} color="#10B981" style={{ marginBottom: '12px' }} />
        <div style={{ fontSize: '18px', fontWeight: '800', color: '#059669', marginBottom: '6px' }}>
          Payment Confirmed!
        </div>
        <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px' }}>
          UTR: <strong>{paymentResult.utrRef}</strong>
          {paymentResult.demo && ' (Demo)'}
        </div>
        <div style={{
          background: 'rgba(16,185,129,0.1)',
          borderRadius: '10px',
          padding: '12px 16px',
          fontSize: '12px',
          color: '#059669',
          fontWeight: '700'
        }}>
          ₹{amount} · Escrow HELD · Releases after ride completion
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div style={{
        background: 'rgba(239,68,68,0.08)',
        border: '1.5px solid #EF4444',
        borderRadius: '16px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <AlertCircle size={32} color="#EF4444" style={{ marginBottom: '10px' }} />
        <div style={{ fontSize: '14px', color: '#DC2626', marginBottom: '12px', fontWeight: '700' }}>
          {errorMsg || 'Payment failed'}
        </div>
        <button
          onClick={() => { setStep('idle'); setErrorMsg(null); }}
          style={{
            background: '#EF4444',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: '700'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  const isProcessing = ['creating', 'paying', 'verifying'].includes(step);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(132, 204, 22,0.08) 0%, rgba(101, 163, 13,0.04) 100%)',
      border: '1.5px solid rgba(132, 204, 22,0.4)',
      borderRadius: '16px',
      padding: '20px'
    }}>
      {/* Amount Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: '#6B7280' }}>Total Payable</div>
        <div style={{ fontSize: '24px', fontWeight: '900', color: '#65A30D' }}>₹{amount}</div>
      </div>

      {/* Trust indicators */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}>
        {[
          { icon: <Shield size={11} />, label: 'Escrow Protected' },
          { icon: <CreditCard size={11} />, label: 'UPI / Card' },
          { icon: <Smartphone size={11} />, label: 'Secure Payment' }
        ].map(({ icon, label }) => (
          <span key={label} style={{
            background: 'rgba(132, 204, 22,0.15)',
            color: '#B45309',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '700',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {icon} {label}
          </span>
        ))}
      </div>

      {/* Processing status */}
      {isProcessing && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '14px',
          fontSize: '13px',
          color: '#84CC16'
        }}>
          <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
          {step === 'creating' && 'Creating secure order...'}
          {step === 'paying' && 'Opening payment gateway...'}
          {step === 'verifying' && 'Verifying payment...'}
        </div>
      )}

      {/* Pay button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        style={{
          width: '100%',
          padding: '14px',
          background: isProcessing
            ? '#6B7280'
            : 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
          color: '#000',
          border: 'none',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: '900',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.2s ease'
        }}
      >
        {isProcessing ? (
          <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
        ) : (
          <><CreditCard size={16} /> Pay ₹{amount} via UPI / Card</>
        )}
      </button>

      <p style={{
        fontSize: '10px',
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: '10px'
      }}>
        🔒 Payment held in escrow · Released only after ride completion
      </p>
    </div>
  );
}
