import React, { useState } from 'react';
import './SeatDetails.css';

const SeatDetails = ({ seat, onBack, onBook }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = seat.images || [seat.image];

  const handleBooking = () => {
    if (seat.vacantSeats > 0) {
      const confirmed = window.confirm(`Book a seat at ${seat.title}? This will reduce available seats from ${seat.vacantSeats} to ${seat.vacantSeats - 1}.`);
      if (confirmed) {
        onBook(seat.id);
        alert('Seat booked successfully!');
      }
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="seat-details">
      <button className="back-btn" onClick={onBack}>
        ← Back to Listings
      </button>
      
      <div className="details-container">
        <div className="details-image">
          <div className="image-gallery">
            <img src={images[currentImageIndex]} alt={seat.title} />
            {images.length > 1 && (
              <>
                <button className="nav-btn prev-btn" onClick={prevImage}>
                  ‹
                </button>
                <button className="nav-btn next-btn" onClick={nextImage}>
                  ›
                </button>
                <div className="image-counter">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
          <div className={`availability-badge ${seat.vacantSeats > 0 ? 'available' : 'booked'}`}>
            {seat.vacantSeats > 0 ? `${seat.vacantSeats} Seats Available` : 'Fully Booked'}
          </div>
        </div>
        
        <div className="details-content">
          <div className="details-header">
            <h1>{seat.title}</h1>
            <div className="seat-badges">
              <span className="seat-type">{seat.type}</span>
              {seat.occupancyType && (
                <span className="occupancy-type">{seat.occupancyType} Occupancy</span>
              )}
              {seat.gender && (
                <span className="gender-type">For {seat.gender}</span>
              )}
            </div>
          </div>
          
          <div className="location-info">
            <p className="location">📍 {seat.location}</p>
            <div className="rating">⭐ {seat.rating} Rating</div>
            <div className="seat-capacity">
              🏠 {seat.vacantSeats}/{seat.totalSeats} Seats Available
            </div>
          </div>
          
          <div className="price-section">
            <span className="price">৳{seat.price}</span>
            <span className="period">/month</span>
          </div>
          
          <div className="description-section">
            <h3>Description</h3>
            <p>{seat.description}</p>
          </div>
          
          <div className="amenities-section">
            <h3>Amenities</h3>
            <div className="amenities-grid">
              {seat.amenities.map((amenity, index) => (
                <div key={index} className="amenity-item">
                  ✓ {amenity}
                </div>
              ))}
            </div>
          </div>
          
          <div className="contact-section">
            <h3>Contact Information</h3>
            <p className="contact-info">📞 {seat.contact}</p>
          </div>
          
          <div className="action-buttons">
            <button 
              className="book-btn" 
              disabled={seat.vacantSeats <= 0}
              onClick={handleBooking}
            >
              {seat.vacantSeats > 0 ? `Book Now (${seat.vacantSeats} left)` : 'Fully Booked'}
            </button>
            <button className="contact-btn">Contact Owner</button>
            {seat.mapLink && (
              <button
                className="map-btn"
                onClick={() => window.open(seat.mapLink, '_blank')}
              >
                Show in Map
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatDetails;
