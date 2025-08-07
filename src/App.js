import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SeatCard from './components/SeatCard';
import SeatDetails from './components/SeatDetails';
import AddSeatForm from './components/AddSeatForm';
import AdminPanel from './components/AdminPanel';
import SearchBar from './components/SearchBar';
import Login from './components/Login';
import Register from './components/Register';
import { onAuthStateChange, logoutUser } from './firebase/auth';
import { createDemoAccounts } from './firebase/setupDemo';

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
      status: "published",
      vacantSeats: 3,
      totalSeats: 8,
      ownerInfo: {
        name: "Ahmed Hassan",
        nidNumber: "1234567890123",
        holdingNumber: "MB-001"
      }
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
      status: "published",
      vacantSeats: 1,
      totalSeats: 1,
      ownerInfo: {
        name: "Fatima Khatun",
        nidNumber: "9876543210987",
        holdingNumber: "UA-025"
      }
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
      status: "published",
      vacantSeats: 6,
      totalSeats: 12,
      ownerInfo: {
        name: "Mohammad Rahman",
        nidNumber: "5678901234567",
        holdingNumber: "KZ-012"
      }
    },
    {
      id: 4,
      title: "Royal Boarding House",
      type: "House",
      location: "Court Para, Rajshahi",
      price: 5500,
      availability: "Booked",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"
      ],
      occupancyType: "Quad",
      gender: "Girls",
      description: "Premium boarding house with excellent facilities.",
      amenities: ["AC", "WiFi", "Generator", "Security"],
      contact: "+880 1611-456789",
      rating: 4.7,
      status: "published",
      vacantSeats: 0,
      totalSeats: 4,
      ownerInfo: {
        name: "Nasreen Akter",
        nidNumber: "1357924680135",
        holdingNumber: "CP-008"
      }
    }
  ]);

  const [pendingRequests, setPendingRequests] = useState([]);

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authAction, setAuthAction] = useState(null); // 'book' or 'publish'
  const [filters, setFilters] = useState({
    type: '',
    gender: '',
    location: '',
    priceRange: '',
    occupancy: '',
    search: ''
  });

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
    });

    // Setup demo accounts on first load (only in development)
    const setupDemo = async () => {
      const hasSetupDemo = localStorage.getItem('demoAccountsSetup');
      if (!hasSetupDemo && process.env.NODE_ENV === 'development') {
        try {
          await createDemoAccounts();
          localStorage.setItem('demoAccountsSetup', 'true');
          console.log('✅ Demo accounts are ready!');
          console.log('📧 You can now login with:');
          console.log('   student@demo.com / 123456');
          console.log('   owner@demo.com / 123456'); 
          console.log('   admin@demo.com / 123456');
        } catch (error) {
          console.log('Demo accounts setup skipped:', error.message);
        }
      }
    };
    
    setupDemo();

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
  };

  const handleBackToList = () => {
    setSelectedSeat(null);
  };

  const handleAddSeat = (newSeat) => {
    const requestWithId = {
      ...newSeat,
      id: Date.now(), // Temporary ID for pending request
      rating: 0,
      status: "pending",
      submittedAt: new Date().toISOString()
    };
    setPendingRequests([...pendingRequests, requestWithId]);
    setShowAddForm(false);
    alert("Your property request has been submitted for admin approval!");
  };

  const handleApproveRequest = (requestId) => {
    const request = pendingRequests.find(req => req.id === requestId);
    if (request) {
      const newSeat = {
        ...request,
        id: Math.max(...seats.map(s => s.id), 0) + 1, // New ID for published seat
        status: "published"
      };
      setSeats([...seats, newSeat]);
      setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
    }
  };

  const handleRejectRequest = (requestId) => {
    setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
  };

  const handleRemoveSeat = (seatId) => {
    setSeats(seats.filter(seat => seat.id !== seatId));
  };

  const handleBookSeat = (seatId) => {
    setSeats(seats.map(seat => {
      if (seat.id === seatId) {
        const newVacantSeats = seat.vacantSeats - 1;
        return { 
          ...seat, 
          vacantSeats: newVacantSeats,
          availability: newVacantSeats <= 0 ? 'Booked' : 'Available'
        };
      }
      return seat;
    }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Authentication handlers
  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setShowLogin(false);
    
    // Execute the pending action if any
    if (authAction === 'publish') {
      setShowAddForm(true);
    } else if (authAction === 'book' && selectedSeat) {
      handleBookSeat(selectedSeat.id);
    }
    setAuthAction(null);
  };

  const handleRegister = (userData) => {
    setCurrentUser(userData);
    setShowRegister(false);
    
    // Execute the pending action if any
    if (authAction === 'publish') {
      setShowAddForm(true);
    } else if (authAction === 'book' && selectedSeat) {
      handleBookSeat(selectedSeat.id);
    }
    setAuthAction(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setShowAdminPanel(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const requireAuth = (action, seatData = null) => {
    if (!currentUser) {
      setAuthAction(action);
      if (seatData) setSelectedSeat(seatData);
      setShowLogin(true);
      return false;
    }
    return true;
  };

  const handleAuthenticatedBooking = (seatId) => {
    if (requireAuth('book', seats.find(s => s.id === seatId))) {
      handleBookSeat(seatId);
    }
  };

  const handleAuthenticatedPublish = () => {
    if (requireAuth('publish')) {
      setShowAddForm(true);
    }
  };

  const filteredSeats = seats.filter(seat => {
    // Only show published seats with vacant seats available
    if (seat.status !== 'published' || seat.vacantSeats <= 0) return false;

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
          onBook={handleAuthenticatedBooking}
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
          pendingRequests={pendingRequests}
          onRemoveSeat={handleRemoveSeat}
          onApproveRequest={handleApproveRequest}
          onRejectRequest={handleRejectRequest}
          onBack={() => setShowAdminPanel(false)}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <Header 
        onAdminClick={() => setShowAdminPanel(true)} 
        currentUser={currentUser}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
      />
      <main className="main-content">
        <div className="hero-section">
          <h1>Find Your Perfect Mess/House in Rajshahi</h1>
          <p>Verified and affordable accommodation for students</p>
          <SearchBar 
            searchTerm={filters.search}
            onSearchChange={(value) => handleFilterChange('search', value)}
          />
        </div>
        
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
          onClick={handleAuthenticatedPublish}
        >
          + Add Your Mess/House
        </button>
      </main>

      {/* Authentication Modals */}
      {showLogin && (
        <Login
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <Register
          onRegister={handleRegister}
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
