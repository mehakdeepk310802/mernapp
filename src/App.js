import React, { useState } from 'react';
import './App.css';
import '../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Customer from './components/Customer';
import Admin from './components/Admin'; // Import the Admin component

function App() {
  const [showCustomer, setShowCustomer] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false); // Add state for admin view

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      {showCustomer ? (
        <Customer />
      ) : showAdmin ? ( // Conditionally render Admin component
        <Admin />
      ) : (
        <div className="card p-3" style={{ width: "25rem", backgroundColor: "white" }}>
          <h3 className="card-title text-center text-dark">Welcome to Mr. Foody</h3>
          <div className="card-body text-center">
            <h5 className="card-title text-dark">Login As</h5>
            <div className="my-2">
              <button 
                onClick={() => setShowCustomer(true)} 
                className="btn btn-success btn-sm w-100"
              >
                Customer
              </button>
            </div>
            <div>
              <button 
                onClick={() => setShowAdmin(true)} // Set admin view state on click
                className="btn btn-danger btn-sm w-100"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;