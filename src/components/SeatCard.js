import React from 'react';
import { Link } from 'react-router-dom';
import './SeatCard.css';

const SeatCard = ({ seat }) => {
  return (
    <Link to={`/details/${seat.id}`} className="seat-card-link">
      <div className="seat-card" style={{ cursor: 'pointer' }}>
      <div className="seat-image">
        <img src={seat.image} alt={seat.title} />
        <div className={`availability-badge ${seat.availability.toLowerCase()}`}>
          {seat.vacantSeats > 0 ? `${seat.vacantSeats} Seats Left` : 'Full'}
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
          <div className="seat-info-right">
            <div className="rating">
              ⭐ {seat.rating}
            </div>
            <div className="seat-count">
              🏠 {seat.vacantSeats}/{seat.totalSeats} Available
            </div>
          </div>
        </div>
        <div className="amenities">
          {seat.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="amenity-tag">{amenity}</span>
          ))}
        </div>
        <div className="card-actions">
          <button type="button" className="view-details-btn">View Details</button>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default SeatCard;
