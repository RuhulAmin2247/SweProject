import React from 'react';
import './Profile.css';

const Profile = ({ user, seats = [], pendingBookings = [], onApproveBooking, onRejectBooking }) => {
  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h2>Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  // If the user is an owner, compute bookings that belong to their seats
  const ownerBookings = (pendingBookings || []).filter(b => {
    if (!user) return false;
    if (user.userType !== 'owner') return false;
    return seats.some(seat => seat.id === b.seatId && (seat.ownerId === (user.uid || user.id) || (seat.ownerInfo && seat.ownerInfo.name === user.name)));
  });

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Your Profile</h1>
        <div className="profile-row">
          <strong>Name:</strong>
          <span>{user.name || 'N/A'}</span>
        </div>
        <div className="profile-row">
          <strong>Email:</strong>
          <span>{user.email}</span>
        </div>
        <div className="profile-row">
          <strong>User Type:</strong>
          <span>{user.userType || 'student'}</span>
        </div>
        <div className="profile-row">
          <strong>Phone:</strong>
          <span>{user.phone || 'N/A'}</span>
        </div>
        {user.nidNumber && (
          <div className="profile-row">
            <strong>NID Number:</strong>
            <span>{user.nidNumber}</span>
          </div>
        )}
        {user.address && (
          <div className="profile-row">
            <strong>Address:</strong>
            <span>{user.address}</span>
          </div>
        )}

        {user.userType === 'owner' && (
          <div className="profile-bookings">
            <h2>Your Bookings</h2>
            {ownerBookings.length === 0 ? (
              <div className="no-properties">
                <h4>No booking requests</h4>
                <p>No one has requested your properties yet.</p>
              </div>
            ) : (
              <div className="bookings-list">
                {ownerBookings.map(b => (
                  <div key={b.id} className="booking-row">
                    <div className="booking-title">{b.seatTitle}</div>
                    <div className="booking-requester">Requester: {b.requester?.name || 'Unknown'}</div>
                    <div className="booking-req">Req: {b.requirements.seatsNeeded} • {b.requirements.roomType} • {b.requirements.attachedBathroom ? 'Attached Bath' : 'No Bath'}</div>
                    <div className="booking-actions">
                      {typeof onApproveBooking === 'function' && (
                        <button className="approve-btn" onClick={() => onApproveBooking(b.id)}>✓ Approve</button>
                      )}
                      {typeof onRejectBooking === 'function' && (
                        <button className="reject-btn" onClick={() => onRejectBooking(b.id)}>✗ Reject</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;