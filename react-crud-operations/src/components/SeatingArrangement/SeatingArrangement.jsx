import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './SeatingArrangement.css';

const SeatingArrangement = () => {
  const [seats, setSeats] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerDetails, setPassengerDetails] = useState({});
  const [boardingPoints, setBoardingPoints] = useState([]);
  const [droppingPoints, setDroppingPoints] = useState([]);
  const [selectedBoardingPointId, setSelectedBoardingPointId] = useState('');
  const [selectedDroppingPointId, setSelectedDroppingPointId] = useState('');
  const { busId } = useParams();
  const token = sessionStorage.getItem('authToken');
  const navigate = useNavigate();
  const busFare = parseFloat(sessionStorage.getItem('busFare'));

  // Redirect to the payment page when seats are selected
  const redirectToPayment = () => {
    // Validate required fields
    if (!selectedBoardingPointId || !selectedDroppingPointId) {
      alert('Please select both Boarding Point and Dropping Point.');
      return;
    }

    for (const seatNo of selectedSeats) {
      const details = passengerDetails[seatNo];
      if (!details || !details.name || !details.gender || !details.age) {
        alert(`Please provide all details for Seat ${seatNo}.`);
        return;
      }
    }

    // Store selected seats, passenger details, and selected points in session storage
    sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    sessionStorage.setItem('passengerDetails', JSON.stringify(passengerDetails));
    sessionStorage.setItem('selectedBoardingPointId', selectedBoardingPointId);
    sessionStorage.setItem('selectedDroppingPointId', selectedDroppingPointId);

    // Redirect to the payment page
    navigate('/payment');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`https://localhost:7114/api/BusSeats/${busId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSeats(response.data);

        const bpresponse = await axios.get(`https://localhost:7114/api/BoardingPoints?busid=${busId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBoardingPoints(bpresponse.data);

        const dpresponse = await axios.get(`https://localhost:7114/api/DroppingPoints?busid=${busId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDroppingPoints(dpresponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the fetchData function inside useEffect
  }, [busId, token, navigate]);

  const handleSeatSelection = (seatNo) => {
    if (selectedSeats.length < 6 || selectedSeats.includes(seatNo)) {
      const index = selectedSeats.indexOf(seatNo);
      if (index === -1) {
        // Add new seat to selectedSeats
        setSelectedSeats([...selectedSeats, seatNo]);
      } else {
        // Remove seat from selectedSeats
        const updatedSeats = [...selectedSeats];
        updatedSeats.splice(index, 1);
        setSelectedSeats(updatedSeats);
      }
    }
  };

  const handlePassengerDetailsChange = (seatNo, key, value) => {
    const updatedDetails = { ...passengerDetails[seatNo], [key]: value };
    setPassengerDetails({ ...passengerDetails, [seatNo]: updatedDetails });
  };

  const handleBoardingPointChange = (event) => {
    const selectedPoint = event.target.value;
    setSelectedBoardingPointId(selectedPoint);
  };

  const handleDroppingPointChange = (event) => {
    const selectedPoint = event.target.value;
    setSelectedDroppingPointId(selectedPoint);
  };

  return (
    <div className="seatSelectionContainer">
      <h1>Select your Seats</h1>

      <div>
        <label htmlFor="boardingPoint">Select Boarding Point:</label>
        <select id="boardingPoint" value={selectedBoardingPointId} onChange={handleBoardingPointChange}>
          <option value="">Boarding Point</option>
          {boardingPoints.map((point) => (
            <option key={point.boardingId} value={point.boardingId}>
              {point.placeName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="droppingPoint">Select Dropping Point:</label>
        <select id="droppingPoint" value={selectedDroppingPointId} onChange={handleDroppingPointChange}>
          <option value="">Dropping Point</option>
          {droppingPoints.map((point) => (
            <option key={point.droppingId} value={point.droppingId}>
              {point.placeName}
            </option>
          ))}
        </select>
      </div>

      <div className="seats">
        {seats &&
          seats.map((seat) => (
            <div key={seat.seatNo} className={`seat ${seat.isBooked ? 'unavailable' : 'available'}`} onClick={() => handleSeatSelection(seat.seatNo)}>
              <input
                type="checkbox"
                id={`inlineCheckbox${seat.seatNo}`}
                value={seat.seatNo}
                disabled={seat.isBooked || (selectedSeats.length >= 6 && !selectedSeats.includes(seat.seatNo))}
                checked={selectedSeats.includes(seat.seatNo)}
                onChange={() => handleSeatSelection(seat.seatNo)}
              />
              <label
                className="form-check-label"
                htmlFor={`inlineCheckbox${seat.seatNo}`}
                data-price={`Rs.${seat.seatPrice}`}
              >
                {seat.seatNo}
              </label>
            </div>
          ))}
      </div>

      <div>
        <p>Total Seats Selected: {selectedSeats.length}</p>
        <p>Total Price: Rs.{selectedSeats.length * busFare}</p>
      </div>

      <button onClick={redirectToPayment} disabled={selectedSeats.length === 0}>
        Proceed to Payment
      </button>

      {/* Passenger Details Section */}
      {selectedSeats.length > 0 && (
        <div className="passengerDetailsSection">
          <h2>Passenger Details</h2>
          {selectedSeats.map((seatNo) => (
            <div key={seatNo} className="passengerDetails">
              <p>Seat Number: {seatNo}</p>
              <input
                type="text"
                placeholder="Name"
                value={passengerDetails[seatNo]?.name || ''}
                onChange={(e) => handlePassengerDetailsChange(seatNo, 'name', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Gender"
                value={passengerDetails[seatNo]?.gender || ''}
                onChange={(e) => handlePassengerDetailsChange(seatNo, 'gender', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Age"
                value={passengerDetails[seatNo]?.age || ''}
                onChange={(e) => handlePassengerDetailsChange(seatNo, 'age', e.target.value)}
                required
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeatingArrangement;
