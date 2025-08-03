import React from 'react';
import './AdminPanel.css';

const AdminPanel = ({ seats, onRemoveSeat, onBack }) => {
  const totalSeats = seats.length;
  const availableSeats = seats.filter(seat => seat.availability === 'Available').length;
  const bookedSeats = seats.filter(seat => seat.availability === 'Booked').length;

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Main
        </button>
        <h1>Admin Panel</h1>
        <div className="admin-stats">
          <div className="stat-card">
            <span className="stat-number">{totalSeats}</span>
            <span className="stat-label">Total Properties</span>
          </div>
          <div className="stat-card available">
            <span className="stat-number">{availableSeats}</span>
            <span className="stat-label">Available</span>
          </div>
          <div className="stat-card booked">
            <span className="stat-number">{bookedSeats}</span>
            <span className="stat-label">Booked</span>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <h2>All Properties</h2>
        <div className="admin-table">
          <div className="table-header">
            <div className="col-id">ID</div>
            <div className="col-title">Property</div>
            <div className="col-type">Type</div>
            <div className="col-location">Location</div>
            <div className="col-price">Price</div>
            <div className="col-status">Status</div>
            <div className="col-actions">Actions</div>
          </div>
          
          {seats.map(seat => (
            <div key={seat.id} className="table-row">
              <div className="col-id">#{seat.id}</div>
              <div className="col-title">
                <div className="property-info">
                  <img src={seat.image} alt={seat.title} className="property-thumb" />
                  <div>
                    <div className="property-name">{seat.title}</div>
                    <div className="property-details">
                      {seat.occupancyType} • {seat.gender}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-type">
                <span className="type-badge">{seat.type}</span>
              </div>
              <div className="col-location">{seat.location}</div>
              <div className="col-price">৳{seat.price}</div>
              <div className="col-status">
                <span className={`status-badge ${seat.availability.toLowerCase()}`}>
                  {seat.availability}
                </span>
              </div>
              <div className="col-actions">
                <button 
                  className="remove-btn"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to remove "${seat.title}"?`)) {
                      onRemoveSeat(seat.id);
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {seats.length === 0 && (
          <div className="no-properties">
            <h3>No properties found</h3>
            <p>No properties have been added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
