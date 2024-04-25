import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [creditCardError, setCreditCardError] = useState('');
  const selectedSeats = JSON.parse(sessionStorage.getItem('selectedSeats')) || [];
  const passengerDetails = JSON.parse(sessionStorage.getItem('passengerDetails')) || {};
  const selectedBoardingPoint = sessionStorage.getItem('selectedBoardingPoint') || '';
  const selectedBoardingPointId = sessionStorage.getItem('selectedBoardingPointId') || '';
  const selectedDroppingPoint = sessionStorage.getItem('selectedDroppingPoint') || '';
  const selectedDroppingPointId = sessionStorage.getItem('selectedDroppingPointId') || '';
  const busFare = parseFloat(sessionStorage.getItem('busFare')) || 0; // Parse float for bus fare
  const token = sessionStorage.getItem('authToken');
  const userId = sessionStorage.getItem('userId')
  const busId = sessionStorage.getItem('busId')
  const navigate = useNavigate();

  const handleCreditCardChange = (e) => {
    const { value } = e.target;
    setCreditCardNumber(value);
  };

  const validateCreditCard = () => {
    // Basic validation for credit card number
    const isValid = /^\d{16}$/.test(creditCardNumber); // Check if the card number is exactly 16 digits

    if (!isValid) {
      setCreditCardError('Please enter a valid 16-digit credit card number.');
      return false;
    } else {
      setCreditCardError('');
      return true;
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    // Validate credit card before proceeding
    if (!validateCreditCard()) {
      alert('Please correct the credit card number.');
      return;
    }

    try {
      console.log(token)

      // Create booking
      const bookingResponse = await axios.post(
        `https://localhost:7114/api/Bookings`,
        {
          userId: userId,
          busId: busId,
          boardingId: selectedBoardingPointId,
          droppingId: selectedDroppingPointId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const bookingId = bookingResponse.data.bookingId;

      for (const seatNo of selectedSeats) {
        const bookingResponse = await axios.post(
            `https://localhost:7114/api/Seats`,
            {
              seatNumber: seatNo,
              bookingId: bookingId,
              amount: busFare,
              cardDetails: creditCardNumber,
              bookingDateTime: new Date().toISOString(),
              passengerName: passengerDetails[seatNo]?.name || '',
              gender: passengerDetails[seatNo]?.gender || '',
              age: passengerDetails[seatNo]?.age || 0,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
      }

      // Proceed with payment processing...
      console.log('Payment submitted successfully!');
      // Add your payment processing logic here
    } catch (error) {
      console.error('Error submitting payment:', error);
      // Handle error, show error message to the user
      alert('Failed to process payment. Please try again.');
    }
    navigate("/paymentsuccess")
  };

  return (
    <div>
      <h2>Payment Details</h2>
      <div>
        <h3>Selected Seats:</h3>
        <ul>
          {selectedSeats.map((seatNo) => (
            <li key={seatNo}>
              Seat {seatNo} - {passengerDetails[seatNo]?.name}, {passengerDetails[seatNo]?.gender}, {passengerDetails[seatNo]?.age}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Boarding Point:</h3>
        <p>{selectedBoardingPoint}</p>
      </div>
      <div>
        <h3>Dropping Point:</h3>
        <p>{selectedDroppingPoint}</p>
      </div>

      {/* Credit card input */}
      <div>
        <label htmlFor="creditCard">Credit Card Number:</label>
        <input
          type="text"
          id="creditCard"
          placeholder="Enter credit card number"
          value={creditCardNumber}
          onChange={handleCreditCardChange}
        />
        {creditCardError && <p style={{ color: 'red' }}>{creditCardError}</p>}
      </div>

      {/* Submit button */}
      <button onClick={handlePaymentSubmit}>Proceed with Payment</button>
    </div>
  );
};

export default Payment;
