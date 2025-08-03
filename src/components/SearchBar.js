import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-section">
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search by location, amenities, type, or any keyword..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          <div className="search-icon">🔍</div>
        </div>
        <div className="search-suggestions">
          <span>Popular searches:</span>
          <button 
            className="suggestion-tag"
            onClick={() => onSearchChange('WiFi')}
          >
            WiFi
          </button>
          <button 
            className="suggestion-tag"
            onClick={() => onSearchChange('AC')}
          >
            AC
          </button>
          <button 
            className="suggestion-tag"
            onClick={() => onSearchChange('University Area')}
          >
            University Area
          </button>
          <button 
            className="suggestion-tag"
            onClick={() => onSearchChange('Furnished')}
          >
            Furnished
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
