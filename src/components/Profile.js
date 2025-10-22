import React from 'react';
import './Profile.css';

const Profile = ({ user }) => {
  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h2>Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

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
      </div>
    </div>
  );
};

export default Profile;