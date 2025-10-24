import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// defaultImageGroups removed — seats are loaded from Firestore
import defaultImageGroups from './config/defaultImages';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import About from './components/About';
import Contact from './components/Contact';
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import SeatCard from './components/SeatCard';
import SeatDetails from './components/SeatDetails';
import AddSeatForm from './components/AddSeatForm';
import AdminPanel from './components/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import SearchBar from './components/SearchBar';
import FirebaseDebug from './components/FirebaseDebug';

function App() {
  const [seats, setSeats] = useState([
    {
      id: 1,
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
      totalSeats: 10,
      mapLink: 'https://www.google.com/maps?q=24.3745,88.6042'
    },
    {
      id: 2,
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
      totalSeats: 4,
      mapLink: 'https://www.google.com/maps?q=24.3700,88.6060'
    },
    {
      id: 3,
      title: 'Bazar Mess',
      type: 'Shared',
      location: 'Shaheb Bazar',
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
      totalSeats: 6,
      mapLink: 'https://www.google.com/maps?q=24.3680,88.6040'
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
  const [pendingRequests, setPendingRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Keep currentUser in sync with Firebase auth state (auto-refresh after verification)
  useEffect(() => {
    let unsub;
    try {
      // Lazy-import to avoid cyclic import issues
      const { onAuthStateChange } = require('./firebase/auth');
      unsub = onAuthStateChange((user) => {
        setCurrentUser(user);
      });
    } catch (err) {
      console.warn('Failed to subscribe to auth state changes', err);
    }

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  // No Firestore subscriptions in this in-memory mode
  useEffect(() => {
    // keep existing in-memory defaults
  }, []);

  // debug banner counts
  const debugBanner = (
    <div style={{ position: 'fixed', left: 12, bottom: 12, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '8px 10px', borderRadius: 8, fontSize: 12, zIndex: 9999 }}>
      Seats: {seats.length} | Pending: {pendingRequests.length}
    </div>
  );

  const handleSeatClick = (seat) => {
    if (!currentUser) {
      // redirect anonymous users to login and return to home (or a detail path if you add one)
      window.location.href = `/login?returnTo=${encodeURIComponent('/')}`;
      return;
    }
    setSelectedSeat(seat);
  };

  const handleBookSeat = (seatId) => {
    setSeats(prev => prev.map(s => {
      if (s.id !== seatId) return s;
      const vacant = Number(s.vacantSeats || 0);
      const total = Number(s.totalSeats || 0);
      const newVacant = Math.max(0, vacant - 1);
      return { ...s, vacantSeats: newVacant, availability: newVacant === 0 ? 'Full' : 'Available' };
    }));
  };

  const handleRemoveSeat = (seatId) => {
    setSeats(prev => prev.filter(s => s.id !== seatId));
  };

  const handleApproveRequest = (requestId) => {
    const req = pendingRequests.find(r => r.id === requestId);
    if (!req) return;
    // convert pending request into an active seat/listing
    const newSeat = {
      ...req,
      status: 'approved',
      availability: (Number(req.vacantSeats || 0) > 0) ? 'Available' : 'Full'
    };
    setSeats(prev => [newSeat, ...prev]);
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleRejectRequest = (requestId) => {
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleOpenLogin = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);
  const handleOpenRegister = () => setShowRegister(true);
  const handleCloseRegister = () => setShowRegister(false);
  const handleLogin = (user) => setCurrentUser(user);
  const handleLogout = () => setCurrentUser(null);

  const filteredSeats = seats.filter(s => {
    if (filters.type && filters.type !== '' && s.type !== filters.type) return false;
    if (filters.gender && filters.gender !== '' && s.gender !== filters.gender) return false;
    if (filters.occupancy && filters.occupancy !== '' && s.occupancyType !== filters.occupancy) return false;
    if (filters.location && filters.location !== '' && s.location !== filters.location) return false;
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase();
      if (!(`${s.title}`.toLowerCase().includes(q) || `${s.location}`.toLowerCase().includes(q))) return false;
    }
    if (filters.priceRange && filters.priceRange !== '') {
      const p = Number(s.price || 0);
      switch (filters.priceRange) {
        case 'Under 4000':
          if (!(p < 4000)) return false;
          break;
        case '4000-5000':
          if (!(p >= 4000 && p <= 5000)) return false;
          break;
        case '5000-6000':
          if (!(p >= 5000 && p <= 6000)) return false;
          break;
        case 'Above 6000':
          if (!(p > 6000)) return false;
          break;
        default:
          break;
      }
    }
    return true;
  });

  const handleBackToList = () => {
    setSelectedSeat(null);
  };

  const handleAddSeat = (newSeat) => {
    // Submit as pending request for admin approval (in-memory)
    const requestWithId = {
      ...newSeat,
      id: Date.now(),
      rating: 0,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      ownerInfo: newSeat.ownerInfo || { name: currentUser?.name || '', nidNumber: newSeat.nidNumber || '', holdingNumber: newSeat.holdingNumber || '' }
    };
    // add to in-memory pending requests and notify user
    setPendingRequests(prev => [requestWithId, ...prev]);
    setShowAddForm(false);
    alert('Your property request has been submitted for admin approval!');

  };

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
          pendingRequests={pendingRequests}
          onRemoveSeat={handleRemoveSeat}
          onApproveRequest={handleApproveRequest}
          onRejectRequest={handleRejectRequest}
          onBack={() => setShowAdminPanel(false)}
        />
      </div>
    );
  }

  // Home component renders the main listing UI
  const Home = () => (
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
            <option value="Kashiadanga">Kashiadanga</option>
            <option value="Shahajipara">Shahajipara</option>
            <option value="Raypara">Raypara</option>
            <option value="Aduburi">Aduburi</option>
            <option value="Shuripara">Shuripara</option>
            <option value="Sayergacha">Sayergacha</option>
            <option value="Hargram">Hargram</option>
            <option value="Harupur">Harupur</option>
            <option value="Hargram Natunpara">Hargram Natunpara</option>
            <option value="Hargram Ranidighi">Hargram Ranidighi</option>
            <option value="Hargram Colony">Hargram Colony</option>
            <option value="Hargram Biddirpara">Hargram Biddirpara</option>
            <option value="Nagorpara">Nagorpara</option>
            <option value="Mollapara">Mollapara</option>
            <option value="Sheikhpara">Sheikhpara</option>
            <option value="Dashpukur">Dashpukur</option>
            <option value="Baharampur">Baharampur</option>
            <option value="Natun Bilsimla">Natun Bilsimla</option>
            <option value="Laxmipur">Laxmipur</option>
            <option value="Hargram Bazar">Hargram Bazar</option>
            <option value="Bulonpur">Bulonpur</option>
            <option value="Goalpara">Goalpara</option>
            <option value="Keshabpur">Keshabpur</option>
            <option value="Nawabganj">Nawabganj</option>
            <option value="Rajpara">Rajpara</option>
            <option value="Mohishbathan">Mohishbathan</option>
            <option value="Kulupura">Kulupura</option>
            <option value="Bhatapara">Bhatapara</option>
            <option value="Chandipur">Chandipur</option>
            <option value="Srirampur">Srirampur</option>
            <option value="Betiapara">Betiapara</option>
            <option value="Kazihata">Kazihata</option>
            <option value="Sipaipara">Sipaipara</option>
            <option value="Hosniganj">Hosniganj</option>
            <option value="Dargapara">Dargapara</option>
            <option value="Jotmahesh">Jotmahesh</option>
            <option value="Sherusarpara">Sherusarpara</option>
            <option value="Hetemkha">Hetemkha</option>
            <option value="Puraton Bilsimla">Puraton Bilsimla</option>
            <option value="Wapda Colony">Wapda Colony</option>
            <option value="Medical Campus">Medical Campus</option>
            <option value="Sojipara">Sojipara</option>
            <option value="Panbahar">Panbahar</option>
            <option value="Malopara">Malopara</option>
            <option value="Razarhata">Razarhata</option>
            <option value="Kadirganj">Kadirganj</option>
            <option value="Methorpara">Methorpara</option>
            <option value="Karikorpara">Karikorpara</option>
            <option value="Fodkipara">Fodkipara</option>
            <option value="Kumarpara">Kumarpara</option>
            <option value="Sahebganj">Sahebganj</option>
            <option value="Saheb Bazar">Saheb Bazar</option>
            <option value="Rani Bazar">Rani Bazar</option>
            <option value="Ganakpara">Ganakpara</option>
            <option value="Miyapara">Miyapara</option>
            <option value="Dorikhorbona">Dorikhorbona</option>
            <option value="Upshohor">Upshohor</option>
            <option value="Terkhadia">Terkhadia</option>
            <option value="Sapura">Sapura</option>
            <option value="Jinnanagar">Jinnanagar</option>
            <option value="Mathuradanga">Mathuradanga</option>
            <option value="Bokhtiarabad">Bokhtiarabad</option>
            <option value="Koyerdara">Koyerdara</option>
            <option value="Barogram">Barogram</option>
            <option value="Naodapara">Naodapara</option>
            <option value="Asam Colony">Asam Colony</option>
            <option value="Paba">Paba</option>
            <option value="Ahmadnagar">Ahmadnagar</option>
            <option value="Firozabad">Firozabad</option>
            <option value="Natunpara">Natunpara</option>
            <option value="TTC">TTC</option>
            <option value="Mothpukur">Mothpukur</option>
            <option value="Shalbagan">Shalbagan</option>
            <option value="Shiroil Colony">Shiroil Colony</option>
            <option value="Chhoto Bongram">Chhoto Bongram</option>
            <option value="Hazarapukur">Hazarapukur</option>
            <option value="Railway Colony">Railway Colony</option>
            <option value="Boalia Para">Boalia Para</option>
            <option value="Sultanabad">Sultanabad</option>
            <option value="Ballobganj">Ballobganj</option>
            <option value="Shiroil">Shiroil</option>
            <option value="Sagorpara">Sagorpara</option>
            <option value="Rampur Bazar">Rampur Bazar</option>
            <option value="Khansamar Chak">Khansamar Chak</option>
            <option value="Ghoramara">Ghoramara</option>
            <option value="Shekherchak">Shekherchak</option>
            <option value="Ramchandrapur">Ramchandrapur</option>
            <option value="Baje Kazla">Baje Kazla</option>
            <option value="Talaimari">Talaimari</option>
            <option value="Raninagar">Raninagar</option>
            <option value="Meherchandi">Meherchandi</option>
            <option value="Namovodra">Namovodra</option>
            <option value="Chokpara">Chokpara</option>
            <option value="Eng Camp">Eng Camp</option>
            <option value="Tikapara">Tikapara</option>
            <option value="Mirerchak">Mirerchak</option>
            <option value="Debisinghpara">Debisinghpara</option>
            <option value="Baliyapukur">Baliyapukur</option>
            <option value="Upor Bhadra">Upor Bhadra</option>
            <option value="Kazla">Kazla</option>
            <option value="Dharampur">Dharampur</option>
            <option value="Char Kazla">Char Kazla</option>
            <option value="Sahatbariya">Sahatbariya</option>
            <option value="Khojapur">Khojapur</option>
            <option value="Dashmari">Dashmari</option>
            <option value="Char Satbariya">Char Satbariya</option>
            <option value="Shyampur">Shyampur</option>
            <option value="University Campus">University Campus</option>
            <option value="Mirjapur">Mirjapur</option>
            <option value="Maskata Dighi">Maskata Dighi</option>
            <option value="Budhpara">Budhpara</option>
            <option value="Mohanpur">Mohanpur</option>
            <option value="Folbagan">Folbagan</option>
            <option value="Krishi Farm">Krishi Farm</option>
            <option value="Gobeshonaloy">Gobeshonaloy</option>
            <option value="Meherchandi Bodhupora">Meherchandi Bodhupora</option>
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
        onClick={() => {
          if (!currentUser) {
            window.location.href = `/login?returnTo=${encodeURIComponent('/add')}`;
            return;
          }
          setShowAddForm(true);
        }}
      >
        + Add Your Mess/House
      </button>
    </main>
  );

  return (
    <Router>
      <div className="App">
        <Header 
          onAdminClick={() => setShowAdminPanel(true)}
          currentUser={currentUser}
          isAdmin={currentUser && currentUser.userType === 'owner'}
          onLogin={handleOpenLogin}
          onLogout={handleLogout}
        />
        {showLogin && (
          <Login 
            onLogin={handleLogin} 
            onClose={handleCloseLogin} 
            onSwitchToRegister={handleOpenRegister}
          />
        )}
        {showRegister && (
          <Register
            onRegister={(user) => { handleLogin(user); }}
            onClose={handleCloseRegister}
            onSwitchToLogin={handleOpenLogin}
          />
        )}
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <Link to="/debug-firebase" style={{ fontSize: 12 }}>Firebase Debug</Link>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<ProtectedRoute currentUser={currentUser}><About /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute currentUser={currentUser}><Contact /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute currentUser={currentUser}><Profile user={currentUser} /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute currentUser={currentUser}><AddSeatForm onSubmit={handleAddSeat} onCancel={() => setShowAddForm(false)} /></ProtectedRoute>} />
          <Route path="/login" element={<Login onLogin={(user) => { handleLogin(user); const params = new URLSearchParams(window.location.search); const ret = params.get('returnTo'); if (ret) { window.location.replace(ret); } }} onClose={() => { window.history.back(); }} onSwitchToRegister={handleOpenRegister} />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/debug-firebase" element={<FirebaseDebug />} />
        </Routes>
          {debugBanner}
      </div>
    </Router>
  );
}

export default App;
