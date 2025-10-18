import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import { getUserStats } from '../firebase/userStats';

const AdminPanel = ({ seats, pendingRequests, onRemoveSeat, onApproveRequest, onRejectRequest, onBack }) => {
  const [activeTab, setActiveTab] = useState('published');
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load user statistics on component mount
  useEffect(() => {
    const loadUserStats = async () => {
      try {
        setLoading(true);
        const stats = await getUserStats();
        setUserStats(stats);
      } catch (error) {
        console.error('Error loading user stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserStats();
  }, []);
  
  const totalSeats = seats.filter(seat => seat.status === 'published').length;
  const availableSeats = seats.filter(seat => seat.status === 'published' && seat.availability === 'Available').length;
  const bookedSeats = seats.filter(seat => seat.status === 'published' && seat.availability === 'Booked').length;
  const pendingCount = pendingRequests.length;

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
            <span className="stat-label">Published</span>
          </div>
          <div className="stat-card available">
            <span className="stat-number">{availableSeats}</span>
            <span className="stat-label">Available</span>
          </div>
          <div className="stat-card booked">
            <span className="stat-number">{bookedSeats}</span>
            <span className="stat-label">Booked</span>
          </div>
          <div className="stat-card pending">
            <span className="stat-number">{pendingCount}</span>
            <span className="stat-label">Pending</span>
          </div>
          {userStats && (
            <>
              <div className="stat-card users">
                <span className="stat-number">{userStats.totalUsers}</span>
                <span className="stat-label">Total Users</span>
              </div>
              <div className="stat-card students">
                <span className="stat-number">{userStats.students}</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat-card owners">
                <span className="stat-number">{userStats.owners}</span>
                <span className="stat-label">Owners</span>
              </div>
              <div className="stat-card admins">
                <span className="stat-number">{userStats.admins}</span>
                <span className="stat-label">Admins</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Requests ({pendingCount})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'published' ? 'active' : ''}`}
            onClick={() => setActiveTab('published')}
          >
            Published Properties ({totalSeats})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users ({userStats ? userStats.totalUsers : '...'})
          </button>
        </div>

        {activeTab === 'pending' && (
          <div className="pending-section">
            <h2>Pending Property Requests</h2>
            {pendingRequests.length === 0 ? (
              <div className="no-properties">
                <h3>No pending requests</h3>
                <p>All submitted properties have been reviewed.</p>
              </div>
            ) : (
              <div className="admin-table">
                <div className="table-header">
                  <div className="col-id">ID</div>
                  <div className="col-title">Property</div>
                  <div className="col-owner">Owner Info</div>
                  <div className="col-location">Location</div>
                  <div className="col-price">Price</div>
                  <div className="col-submitted">Submitted</div>
                  <div className="col-actions">Actions</div>
                </div>
                
                {pendingRequests.map(request => (
                  <div key={request.id} className="table-row pending-row">
                    <div className="col-id">#{request.id}</div>
                    <div className="col-title">
                      <div className="property-info">
                        <img src={request.image} alt={request.title} className="property-thumb" />
                        <div>
                          <div className="property-name">{request.title}</div>
                          <div className="property-details">
                            {request.occupancyType} • {request.gender} • {request.type}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-owner">
                      <div className="owner-info">
                        <div className="owner-name">{request.ownerInfo.name}</div>
                        <div className="owner-details">
                          NID: {request.ownerInfo.nidNumber}
                        </div>
                        <div className="owner-details">
                          Holding: {request.ownerInfo.holdingNumber}
                        </div>
                      </div>
                    </div>
                    <div className="col-location">{request.location}</div>
                    <div className="col-price">৳{request.price}</div>
                    <div className="col-submitted">
                      {new Date(request.submittedAt).toLocaleDateString()}
                    </div>
                    <div className="col-actions">
                      <button 
                        className="approve-btn"
                        onClick={() => onApproveRequest(request.id)}
                      >
                        ✓ Approve
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => {
                          if (window.confirm(`Reject "${request.title}"? This action cannot be undone.`)) {
                            onRejectRequest(request.id);
                          }
                        }}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'published' && (
          <div className="published-section">
            <h2>Published Properties</h2>
            {seats.filter(seat => seat.status === 'published').length === 0 ? (
              <div className="no-properties">
                <h3>No published properties</h3>
                <p>No properties have been published yet.</p>
              </div>
            ) : (
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
                
                {seats.filter(seat => seat.status === 'published').map(seat => (
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
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <h2>User Management</h2>
            {loading ? (
              <div className="loading">Loading user data...</div>
            ) : userStats && userStats.userList.length > 0 ? (
              <div className="admin-table">
                <div className="table-header">
                  <div className="col-email">Email</div>
                  <div className="col-name">Name</div>
                  <div className="col-type">Type</div>
                  <div className="col-date">Joined</div>
                  <div className="col-actions">Status</div>
                </div>
                
                {userStats.userList.map((user, index) => (
                  <div key={user.email} className="table-row">
                    <div className="col-email">{user.email}</div>
                    <div className="col-name">{user.name}</div>
                    <div className="col-type">
                      <span className={`user-type ${user.userType}`}>
                        {user.userType}
                      </span>
                    </div>
                    <div className="col-date">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="col-actions">
                      <span className="status-active">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-properties">
                <h3>No users found</h3>
                <p>No registered users in the system.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
