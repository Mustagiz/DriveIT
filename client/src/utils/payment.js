export async function initiateRazorpayPayment({
  amount,
  currency = 'INR',
  bookingRef,
  passengerName,
  description
}) {
  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo_key',
          amount: Math.round(amount * 100),
          currency,
          name: 'Driveit Intercity',
          description: description || `Booking ${bookingRef}`,
          prefill: {
            name: passengerName || 'Passenger',
            contact: '+91 98110 54321',
            email: 'passenger@driveit.in'
          },
          notes: {
            bookingRef: bookingRef || ''
          },
          theme: {
            color: '#FFC800'
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
        resolve({ razorpay, options });
      };
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.head.appendChild(script);
    } catch (err) {
      console.error('Razorpay initialization failed:', err);
      reject(new Error('Payment gateway unavailable. Please try cash/UPI payment.'));
    }
  });
}
