import React from 'react';
import './SeatCard.css';

const SeatCard = ({ seat, onClick }) => {
  return (
    <div className="seat-card" onClick={onClick}>
      <div className="seat-image">
        <img src={seat.image} alt={seat.title} />
        <div className={`availability-badge ${seat.availability.toLowerCase()}`}>
          {seat.availability}
        </div>
      </div>
      <div className="seat-info">
        <div className="seat-header">
          <h3>{seat.title}</h3>
          <div className="seat-badges">
            <span className="seat-type">{seat.type}</span>
            {seat.occupancyType && (
              <span className="occupancy-type">{seat.occupancyType}</span>
            )}
            {seat.gender && (
              <span className="gender-type">{seat.gender}</span>
            )}
          </div>
        </div>
        <p className="location">📍 {seat.location}</p>
        <p className="description">{seat.description}</p>
        <div className="seat-footer">
          <div className="price">
            <span className="amount">৳{seat.price}</span>
            <span className="period">/month</span>
          </div>
          <div className="rating">
            ⭐ {seat.rating}
          </div>
        </div>
        <div className="amenities">
          {seat.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="amenity-tag">{amenity}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatCard;
