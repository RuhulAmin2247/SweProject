import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  const [inputValue, setInputValue] = useState(searchTerm || '');

  // Keep local input in sync if parent forces a different searchTerm
  useEffect(() => {
    setInputValue(searchTerm || '');
  }, [searchTerm]);

  const handleSubmit = (value) => {
    const trimmed = (value || '').trim();
    onSearchChange(trimmed);
  };

  return (
    <div className="search-section">
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search by location, amenities, type, or any keyword..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(inputValue);
              }
            }}
            className="search-input"
          />
          <button
            type="button"
            className="search-icon"
            onClick={() => handleSubmit(inputValue)}
            aria-label="Search"
          >
            🔍
          </button>
        </div>
        <div className="search-suggestions">
          <span>Popular searches:</span>
          <button 
            className="suggestion-tag"
            onClick={() => { setInputValue('WiFi'); handleSubmit('WiFi'); }}
          >
            WiFi
          </button>
          <button 
            className="suggestion-tag"
            onClick={() => { setInputValue('AC'); handleSubmit('AC'); }}
          >
            AC
          </button>
          <button 
            className="suggestion-tag"
            onClick={() => { setInputValue('University Area'); handleSubmit('University Area'); }}
          >
            University Area
          </button>
          <button 
            className="suggestion-tag"
            onClick={() => { setInputValue('Furnished'); handleSubmit('Furnished'); }}
          >
            Furnished
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
