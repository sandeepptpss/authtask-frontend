import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Users from './Users';
import Products from './Products';
import AddBlog from './AddBlog';
import '../assets/dashbord.css';


const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  }

  const handleProfileOption = (option) => {
    if (option === 'view-profile') {
      navigate('/profile');
    } else if (option === 'logout') {
      localStorage.removeItem('token');
      navigate('/login');
    }
    setShowDropdown(false);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-profile')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Here you can implement the search logic based on the active section
    // For example:
    if (activeSection === 'users') {
      // Search in users
    } else if (activeSection === 'products') {
      // Search in products
    } else if (activeSection === 'blog') {
      // Search in blogs
    }
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await fetch("http://localhost:8002/api/profile", {
          method: "GET",
          headers: { "Authorization": token, "Content-Type": "application/json" },
        })

        const data = await response.json();
        if (response.ok) {
          setUser(data.profile);
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    }
    fetchUserProfile();
  }, []);

  return (
    <div className="admin-panel">
      <header>
        <div className="logosec">
          <div className="logo">Admin Dashboard</div>
        </div>
        <div className="searchbar">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="message">
          <div className="circle"></div>
          <img 
            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/8.png"
            className="icn"
            alt="notifications"
          />
          <div className="user-profile">
            <img 
              src={user?.profile 
                ? `http://localhost:8002/${user.profile}`
                : "https://via.placeholder.com/120"
              }
              className="dpicn"
              alt="profile"
              onClick={toggleDropdown}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <p onClick={() => handleProfileOption('view-profile')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Edit Profile
                </p>
                <p onClick={() => handleProfileOption('logout')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="navcontainer">
        <nav className="nav">
          <div className="nav-upper-options">
            <div className={`nav-option ${activeSection === 'home' ? 'active' : ''}`} onClick={() => setActiveSection('home')}>
              <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182148/Untitled-design-(29).png" className="nav-img" alt="dashboard" />
              <h3>Dashboard</h3>
            </div>

            <div className={`nav-option ${activeSection === 'users' ? 'active' : ''}`} onClick={() => setActiveSection('users')}>
              <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183323/10.png" className="nav-img" alt="user" />
              <h3>User</h3>
            </div>
            
            <div className={`nav-option ${activeSection === 'blog' ? 'active' : ''}`} onClick={() => setActiveSection('blog')}>
              <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183323/10.png" className="nav-img" alt="user" />
              <h3>Add Blog</h3>
            </div>
            
            <div className={`nav-option ${activeSection === 'products' ? 'active' : ''}`} onClick={() => setActiveSection('products')}>
              <img src="https://cdn-icons-png.flaticon.com/512/2907/2907764.png" className="nav-img" alt="products" />
              <h3>Products</h3>
            </div>
          </div>
        </nav>
      </div>

      <div className="main-content">
        {activeSection === 'users' ? <Users /> : activeSection === 'products' ? <Products /> : activeSection === 'blog' ? <AddBlog /> : <div className="main-content"><h2>Welcome to the Admin Panel</h2><p>Select an option from the sidebar to get started.</p></div>}
      </div>
    </div>
  );
};

export default Dashboard;
