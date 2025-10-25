import React, { useState } from 'react';
import './SeatDetails.css';

const SeatDetails = ({ seat, onBack, onBook, currentUser }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = seat.images || [seat.image];

  // Booking requirements modal state
  const [showReqForm, setShowReqForm] = useState(false);
  const [reqForm, setReqForm] = useState({
    seatsNeeded: 1,
    sameRoom: true,
    floor: '',
    roomType: 'Single',
    attachedBathroom: false
  });

  const openReqForm = () => {
    setReqForm({ seatsNeeded: 1, sameRoom: true, floor: '', roomType: 'Single', attachedBathroom: false });
    setShowReqForm(true);
  };

  const handleReqChange = (field, value) => {
    setReqForm(prev => ({ ...prev, [field]: value }));
  };

  const submitRequirements = (e) => {
    e.preventDefault();
    const seatsNeededNum = Number(reqForm.seatsNeeded) || 1;
    if (seatsNeededNum <= 0) {
      alert('Please choose at least 1 seat');
      return;
    }
    if (seatsNeededNum > (seat.vacantSeats || 0)) {
      const ok = window.confirm(`Only ${seat.vacantSeats || 0} seats are available. Do you want to request ${seat.vacantSeats || 0} instead?`);
      if (!ok) return;
      handleReqChange('seatsNeeded', seat.vacantSeats || 0);
    }

    onBook(seat.id, { ...reqForm, seatsNeeded: seatsNeededNum });
    setShowReqForm(false);
  };

  const handleBooking = () => {
    // require login for booking; viewing details is public
    if (!currentUser) {
      window.location.href = `/login?returnTo=${encodeURIComponent(window.location.href)}`;
      return;
    }
    // open requirement form modal instead of immediate confirm
    if (seat.vacantSeats > 0) {
      openReqForm();
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
        {/* Booking Requirements Modal */}
        {showReqForm && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>Booking Requirements for {seat.title}</h3>
              <form onSubmit={submitRequirements} className="booking-form">
                <label>
                  How many seats needed
                  <input type="number" min="1" value={reqForm.seatsNeeded} onChange={(e) => handleReqChange('seatsNeeded', e.target.value)} />
                </label>

                <label>
                  Seats in same room?
                  <select value={reqForm.sameRoom ? 'yes' : 'no'} onChange={(e) => handleReqChange('sameRoom', e.target.value === 'yes')}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>

                <label>
                  Floor (optional)
                  <input type="text" value={reqForm.floor} onChange={(e) => handleReqChange('floor', e.target.value)} placeholder="e.g., 2nd floor" />
                </label>

                <label>
                  Room type
                  <select value={reqForm.roomType} onChange={(e) => handleReqChange('roomType', e.target.value)}>
                    <option>Single</option>
                    <option>Double</option>
                    <option>Triple</option>
                    <option>Quad</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  Attached bathroom
                  <select value={reqForm.attachedBathroom ? 'yes' : 'no'} onChange={(e) => handleReqChange('attachedBathroom', e.target.value === 'yes')}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowReqForm(false)}>Cancel</button>
                  <button type="submit" className="submit-btn">Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatDetails;
