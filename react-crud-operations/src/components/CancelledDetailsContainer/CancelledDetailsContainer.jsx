import React from 'react';
import './CancelledDetailsContainer.css'

function DetailsContainer({ booking }) {
  const {
    busName,
    busType,
    seatNo,
    passengerName,
    gender,
    age,
    boarding,
    dropping,
    boardingTime,
    droppingTime,
    bookingTime,
    departureDate
  } = booking;

  const parsedBookingTime = new Date(bookingTime);
  const parsedDepartureDate = new Date(departureDate);

  const formatDateTime = (dateTime) => {
    const parsedDate = new Date(dateTime);
    if (isNaN(parsedDate)) return 'Not specified';

    return parsedDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formattedBookingTime = formatDateTime(bookingTime);
  const formattedDepartureDate = formatDateTime(departureDate);

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';

    const [hours, minutes] = timeString.split(':');
    const formattedTime = `${parseInt(hours, 10) % 12 || 12}:${minutes} ${parseInt(hours, 10) >= 12 ? 'PM' : 'AM'}`;
    return formattedTime;
  };

  const formattedBoardingTime = formatTime(boardingTime);
  const formattedDroppingTime = formatTime(droppingTime);

  return (
    <div className="detailsBusListingContainer">
      <div className="detailsBusCardContainer">
        <div className="detailsBusCard">
          <div className="detailHeader">
            <h2 className="detailBusName">Bus Name: {busName}</h2>
          </div>
          <div className="detailsRow">
            <div className="detailLabel">Bus Type:</div>
            <div className="detailValue">{busType}</div>
          </div>
          <div className="detailsRow">
            <div className="detailLabel">Seat Number:</div>
            <div className="detailValue">{seatNo}</div>
            <div className="detailLabel">Passenger Name:</div>
            <div className="detailValue">{passengerName}</div>
            <div className="detailLabel">Gender:</div>
            <div className="detailValue">{gender}</div>
            <div className="detailLabel">Age:</div>
            <div className="detailValue">{age}</div>
          </div>
          <div className="detailsRow">
            <div className="detailLabel">Boarding:</div>
            <div className="detailValue">{boarding} ({formattedBoardingTime})</div>
          </div>
          <div className="detailsRow">
            <div className="detailLabel">Dropping:</div>
            <div className="detailValue">{dropping} ({formattedDroppingTime})</div>
          </div>
          <div className="detailsRow">
            <div className="detailLabel">Booking Date Time:</div>
            <div className="detailValue">{formattedBookingTime}</div>
            <div className="detailLabel">Departure Date:</div>
            <div className="detailValue">{formattedDepartureDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsContainer;
