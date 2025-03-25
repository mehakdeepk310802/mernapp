import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogOut = async () => {
    localStorage.removeItem("authToken");
    navigate("/loginadmin");
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand fs-1 fst-italic" to="/">Mr.Foody</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2">
              <li className="nav-item">
                <Link className="nav-link active fs-5" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active fs-5" aria-current="page" to="/">Admin Info</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active fs-5" aria-current="page" to="/">Customers</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active fs-5" aria-current="page" to="/">Orders</Link>
              </li>
            </ul>
            {(!localStorage.getItem("authToken")) ? (
              <div className='d-flex'>
                <Link className="btn bg-white text-success mx-1" to="/loginadmin">Login</Link>
                <Link className="btn bg-white text-success mx-1" to="/createadmin">SignUp</Link>
              </div>
            ) : (
              <div>
                <div className="btn bg-white text-danger mx-2" onClick={handleLogOut}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;