import { useEffect, useState } from 'react';
import axios from 'axios';
import './BusDetails.css';
import { Link ,useNavigate} from 'react-router-dom';
import BusOperatorNavbar from '../BusOperatorNavbar/BusOperatorNavbar';

function BusDetails() {
  const [busDetails, setBusDetails] = useState([]);
  const token = sessionStorage.getItem('authToken');
  const navigate=useNavigate()

  

  useEffect(() => {
    const fetchBusDetails = async () => {
      if(!token){
        navigate("/login")
      }
      try {
        const busOperatorId = sessionStorage.getItem('userId');
        if (!busOperatorId) {
          throw new Error('Bus operator ID not found in session storage');
        }
        console.log(busOperatorId)
        const response = await axios.get(
          `https://localhost:7114/api/Buses/getBusByOperatorId?busOperatorId=${busOperatorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setBusDetails(response.data); 
        console.log(busDetails)
      } catch (error) {
        if(error.response && error.response.status === 403){
          window.alert("Unuthorized")
        }
        console.error('Error fetching bus details:', error.message);
      }
    };

    fetchBusDetails(); 
  }, []); 

  const handleDeleteBus=async (busId)=>{
    const confirmed = window.confirm('Are you sure you want to delete this bus?');

    if (!confirmed) {
      return; // If not confirmed, do nothing
    }
    try {
      const sresponse = await axios.delete(
        `https://localhost:7114/api/Buses/${busId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      window.alert('Bus deleted successfully.');
    } catch (error) {
      if(error.response && error.response.status === 403){
        window.alert("Unuthorized")
      }
      console.error('Error fetching bus details:', error.message);
    }
  }

  return (
    <div><BusOperatorNavbar/>
     <table className="table table-dark">
        <thead>
          <tr>
            <th>Bus Name</th>
            <th>Bus Number</th>
            <th>Bus Type</th>
            <th>Total Seats</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Fare</th>
            <th>Departure Date</th>
          </tr>
        </thead>
        <tbody>
          {busDetails.map((bus) => (
            <tr key={bus.busId}>
              <td>{bus.busName}</td>
              <td>{bus.busNumber}</td>
              <td>{bus.busType}</td>
              <td>{bus.noOfSeats}</td>
              <td>{bus.origin}</td>
              <td>{bus.destination}</td>
              <td>{bus.startTime}</td>
              <td>{bus.endTime}</td>
              <td>{bus.fare}</td>
              <td>{bus.departureDate}</td>
              <td>
                <button
                  type="button" 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteBus(bus.busId)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BusDetails;