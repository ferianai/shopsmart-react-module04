import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom to navigate

const PaymentSuccess: React.FC = () => {
  return (
    <div className="payment-success-container">
      <h1 className="text-3xl font-bold mb-4 text-center text-green-600">Payment Successful!</h1>
      <div className="text-center mb-6">
        <p>Your payment has been successfully processed. Thank you for your purchase!</p>
        <p>If you have any questions, feel free to contact support.</p>
      </div>
      
      {/* Button to navigate back to home page */}
      <div className="text-center">
        <Link to="/" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
