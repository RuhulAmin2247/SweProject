import React, { useState } from 'react';
import './App.css';
import defaultImageGroups from './config/defaultImages';
import Header from './components/Header';
import SeatCard from './components/SeatCard';
import SeatDetails from './components/SeatDetails';
import AddSeatForm from './components/AddSeatForm';
import AdminPanel from './components/AdminPanel';
import SearchBar from './components/SearchBar';

function App() {
  const [seats, setSeats] = useState([
    {
      id: 1,
      title: "Modern Mess - Shaheb Bazar",
      type: "Mess",
      location: "Shaheb Bazar, Rajshahi",
      price: 4500,
      availability: "Available",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400",
      images: [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"
      ],
      occupancyType: "Double",
      gender: "Boys",
      description: "Clean and hygienic mess with home-cooked food. 3 meals included.",
      amenities: ["WiFi", "AC", "Laundry", "24/7 Security"],
      contact: "+880 1711-123456",
      rating: 4.5,
      vacantSeats: 4,
      totalSeats: 8
    },
    {
      id: 2,
      title: "Student House - University Area",
      type: "House",
      location: "University Area, Rajshahi",
      price: 6000,
      availability: "Available",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"
      ],
      occupancyType: "Single",
      gender: "Girls",
      description: "Furnished single room near Rajshahi University. Perfect for students.",
      amenities: ["WiFi", "Furnished", "Kitchen Access", "Study Room"],
      contact: "+880 1811-234567",
      rating: 4.2,
      vacantSeats: 2,
      totalSeats: 2
    },
    {
      id: 3,
      title: "Green Valley Mess",
      type: "Mess",
      location: "Kazla, Rajshahi",
      price: 3800,
      availability: "Available",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400"
      ],
      occupancyType: "Triple",
      gender: "Boys",
      description: "Affordable mess with quality food and friendly environment.",
      amenities: ["WiFi", "Common Room", "Library", "Medical Facility"],
      contact: "+880 1911-345678",
      rating: 4.0,
      vacantSeats: 3,
      totalSeats: 6
    },
    {
      id: 4,
      title: 'Cozy Mess near Campus',
      type: 'Mess',
      location: 'Near ABC University',
      price: 2500,
      image: defaultImageGroups[0][0],
      images: defaultImageGroups[0],
      occupancyType: 'Single',
      gender: 'Male',
      amenities: ['WiFi', 'Laundry'],
      contact: '9876543210',
      rating: 4.2,
      availability: 'Available',
      vacantSeats: 5,
      totalSeats: 10
    },
    {
      id: 5,
      title: 'Budget-friendly PG',
      type: 'PG',
      location: 'Downtown',
      price: 1800,
      image: defaultImageGroups[1][0],
      images: defaultImageGroups[1],
      occupancyType: 'Double',
      gender: 'Female',
      amenities: ['AC', 'Meals'],
      contact: '9123456780',
      rating: 4.0,
      availability: 'Available',
      vacantSeats: 1,
      totalSeats: 4
    },
    {
      id: 6,
      title: 'Shared Rooms Near Metro',
      type: 'Shared',
      location: 'Near Metro Station',
      price: 1500,
      image: defaultImageGroups[2][0],
      images: defaultImageGroups[2],
      occupancyType: 'Triple',
      gender: 'Unisex',
      amenities: ['Kitchen', 'Parking'],
      contact: '9988776655',
      rating: 3.8,
      availability: 'Available',
      vacantSeats: 2,
      totalSeats: 6
    }
  ]);

  // UI state and filters
  const [filters, setFilters] = useState({
    type: '',
    gender: '',
    occupancy: '',
    location: '',
    priceRange: '',
    search: ''
  });

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
  };

  const handleBackToList = () => {
    setSelectedSeat(null);
  };

  const handleAddSeat = (newSeat) => {
    setSeats(prev => [{ id: prev.length + 1, ...newSeat }, ...prev]);
    setShowAddForm(false);
  };

  const handleRemoveSeat = (id) => {
    setSeats(prev => prev.filter(s => s.id !== id));
  };

  const handleBookSeat = (id) => {
    setSeats(prev => prev.map(s => s.id === id ? { ...s, availability: 'Booked' } : s));
    setSelectedSeat(null);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredSeats = seats.filter(seat => {
    // Only show available seats (remove booked ones from main listing)
    if (seat.availability === 'Booked') return false;

    // Filter by type
    if (filters.type && filters.type !== 'All Types' && seat.type !== filters.type) {
      return false;
    }

    // Filter by gender
    if (filters.gender && filters.gender !== 'All Gender' && seat.gender !== filters.gender) {
      return false;
    }

    // Filter by location
    if (filters.location && filters.location !== 'All Areas') {
      if (!seat.location.includes(filters.location)) return false;
    }

    // Filter by occupancy
    if (filters.occupancy && filters.occupancy !== 'All Occupancy' && seat.occupancyType !== filters.occupancy) {
      return false;
    }

    // Filter by price range
    if (filters.priceRange && filters.priceRange !== 'Price Range') {
      const price = seat.price;
      switch (filters.priceRange) {
        case 'Under 4000':
          if (price >= 4000) return false;
          break;
        case '4000-5000':
          if (price < 4000 || price > 5000) return false;
          break;
        case '5000-6000':
          if (price < 5000 || price > 6000) return false;
          break;
        case 'Above 6000':
          if (price <= 6000) return false;
          break;
        default:
          break;
      }
    }

    // Filter by search text
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = [
        seat.title,
        seat.location,
        seat.description,
        ...seat.amenities,
        seat.type,
        seat.occupancyType,
        seat.gender
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchTerm)) return false;
    }

    return true;
  });

  if (selectedSeat) {
    return (
      <div className="App">
        <SeatDetails 
          seat={selectedSeat} 
          onBack={handleBackToList}
          onBook={handleBookSeat}
        />
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div className="App">
        <AddSeatForm onSubmit={handleAddSeat} onCancel={() => setShowAddForm(false)} />
      </div>
    );
  }

  if (showAdminPanel) {
    return (
      <div className="App">
        <AdminPanel 
          seats={seats}
          onRemoveSeat={handleRemoveSeat}
          onBack={() => setShowAdminPanel(false)}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <Header onAdminClick={() => setShowAdminPanel(true)} />
      <main className="main-content">
        <div className="hero-section">
          <h1>Find Your Perfect Mess/House in Rajshahi</h1>
          <p>Verified and affordable accommodation for students</p>
        </div>
        
        <SearchBar 
          searchTerm={filters.search}
          onSearchChange={(value) => handleFilterChange('search', value)}
        />
        
        <div className="filter-section">
          <div className="filters">
            <select 
              className="filter-select"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Mess">Mess</option>
              <option value="House">House</option>
            </select>
            
            <select 
              className="filter-select"
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
            >
              <option value="">All Gender</option>
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
            </select>
            
            <select 
              className="filter-select"
              value={filters.occupancy}
              onChange={(e) => handleFilterChange('occupancy', e.target.value)}
            >
              <option value="">All Occupancy</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
              <option value="Quad">Quad</option>
            </select>
            
            <select 
              className="filter-select"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">All Areas</option>
              <option value="University Area">University Area</option>
              <option value="Shaheb Bazar">Shaheb Bazar</option>
              <option value="Kazla">Kazla</option>
              <option value="Court Para">Court Para</option>
            </select>
               
            <select 
              className="filter-select"
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            >
              <option value="">Price Range</option>
              <option value="Under 4000">Under ৳4000</option>
              <option value="4000-5000">৳4000-5000</option>
              <option value="5000-6000">৳5000-6000</option>
              <option value="Above 6000">Above ৳6000</option>
            </select>
          </div>
        </div>

        <div className="results-info">
          <p>{filteredSeats.length} properties found</p>
        </div>

        <div className="seats-grid">
          {filteredSeats.map(seat => (
            <SeatCard 
              key={seat.id} 
              seat={seat} 
              onClick={() => handleSeatClick(seat)} 
            />
          ))}
        </div>

        {filteredSeats.length === 0 && (
          <div className="no-results">
            <h3>No properties found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        )}

        <button 
          className="add-seat-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Your Mess/House
        </button>
      </main>
    </div>
  );
}

export default App;
