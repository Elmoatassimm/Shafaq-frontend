/*

import Toast from "./Toast";
import apiFetch from "../apiFetch";
import { useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to replace this with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/app/dashboard`,
      },
      redirect: 'if_required'
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Payment status: ' + paymentIntent.status);
    } else {
      setMessage('Unexpected state');
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-96 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Test Card Numbers:</h3>
          <p className="text-sm">✅ Success: 4242 4242 4242 4242</p>
          <p className="text-sm">❌ Decline: 4000 0000 0000 0002</p>
          <p className="text-sm text-blue-600">Use any future date and CVC</p>
        </div>

        <form onSubmit={handleSubmit}>
          <PaymentElement />
          
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.includes('succeeded') 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <button 
            type="submit"
            disabled={isProcessing || !stripe || !elements}
            className={`
              mt-6 w-full py-3 px-4 rounded-lg
              ${isProcessing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'} 
              text-white font-medium transition-colors
            `}
          >
            {isProcessing ? 'Processing...' : 'Pay now'}
          </button>
        </form>
      </div>
    </div>
  );
};

const PaymentWrapper = () => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
 useEffect(() => {
  apiFetch('/api/create-payment-intent', { method: 'GET', auth: true })
    .then((res) => res.json())
    .then((data) => setClientSecret(data.clientSecret))
    .catch((err) => console.error('Error:', err));
}, []);


  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#2563eb',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#dc2626',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    }
  };

  const options = {
    clientSecret,
    appearance,
  };

  return clientSecret ? (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  ) : (
    <div className="min-h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );
};

export default PaymentWrapper;

*/

/**
 * FakePaymentComponent
 * 
 * This component is used in place of a real Stripe payment form.
 * Due to issues with Stripe packages not working in our Vercel environment when using a Laravel backend,
 * we have replaced the real Stripe integration with this simulated payment component.
 *
 * The original Stripe integration code is attached as comments within the component.
 *
  // If you want to test real Stripe integration, you can use the original code above by
            // removing this simulated code block and uncommenting the original code. Text me to give
            // you a test secret key.
 */

import React, { useState, useEffect, use, useContext } from "react";
import Toast from "./Toast";
import apiFetch from "../apiFetch";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";

const FakePaymentComponent = () => {

  const authContext = use(AuthContext);
  
  const { fetchUser } = authContext;

  
   
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  

  // Form field states
  const [cardNumber, setCardNumber] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState({});

  // Fetch the payment intent when the component mounts.
  // If the API returns "User already paid", we set the message accordingly.
  useEffect(() => {
    apiFetch("create-payment-intent", { method: "GET", auth: true })
      .then((res) => res.json())
      .then((data) => {
        
        // If the API returns a "User already paid" message, set message.
        if (data.message && data.message === "User already paid") {
          
          setMessage(data.message);
         
        } else {

          setClientSecret(data.clientSecret);
          
        }
        
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  // Watch the message state; if it becomes "User already paid",
  // automatically navigate to /app/dashboard
  useEffect(() => {
    if (message === "User already paid") {
      setTimeout(() => {
        navigate("/app/dashboard");
      }, 2000);
    }
   
  }, [message, navigate]);

  // Validate form fields.
  const sanitizedCardNumber = cardNumber.replace(/\s+/g, "");
  const isCardValid = /^\d{16}$/.test(sanitizedCardNumber);
  const isCvcValid = /^\d{3,4}$/.test(cvc);
  const isFormValid = isCardValid && isCvcValid;

  const validateForm = () => {
    let formErrors = {};
    if (!isCardValid) {
      formErrors.cardNumber = "Invalid card number. Must be exactly 16 digits.";
    }
    if (!isCvcValid) {
      formErrors.cvc = "Invalid CVC. Must be 3 or 4 digits.";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handlePayment = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate asynchronous payment processing
    setTimeout(() => {
      // If the API response indicated that the user is already paid,
      // navigate directly to the dashboard.
      if (message === "User already paid") {
        setTimeout(() => {
          navigate("/app/dashboard");
        }, 2000);
        return;
      }

      // Otherwise, simulate a successful payment:
      setMessage("Payment successful (simulated)!");
      setIsProcessing(false);

      // Navigate to the dashboard after showing the success message.
      setTimeout(() => {
        navigate("/app/dashboard");

        
      }, 2000);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 relative">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl">Simulated Payment Form</h2>
          <form onSubmit={handlePayment}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Card Number</span>
              </label>
              <input
                type="text"
                placeholder="4242424242424242"
                className="input input-bordered w-full"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={16}
                inputMode="numeric"
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
              )}
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">CVC</span>
              </label>
              <input
                type="text"
                placeholder="CVC"
                className="input input-bordered w-full"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                maxLength={4}
                inputMode="numeric"
              />
              {errors.cvc && (
                <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>
              )}
            </div>
            <div className="form-control mt-6">
              <button
                type="submit"
                disabled={!isFormValid || isProcessing}
                className={`btn btn-primary ${isProcessing ? "loading-ring" : ""}`}
              >
                {isProcessing ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Toast for displaying payment messages */}
      <Toast
        success={true}
        message={message}
        onClose={() => setMessage("")}
        duration={3000}
      />
    </div>
  );
};

export default FakePaymentComponent;
