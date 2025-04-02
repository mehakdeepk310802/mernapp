import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState([]);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/admin/loginadmin", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        setErrors(json.errors || []);
        alert(json.message || "Enter Valid Credentials");
        return;
      }

      if (json.success) {
        // Store tokens and user info
        localStorage.setItem("accessToken", json.accessToken);
        localStorage.setItem("refreshToken", json.refreshToken);
        localStorage.setItem("refreshTokenExpiry", json.refreshTokenExpiry);
        localStorage.setItem("userEmail", json.user.email);
        localStorage.setItem("userName", json.user.name);
        localStorage.setItem("userLocation", json.user.location);

        alert("Login successful");
        navigate("/admin"); // Navigate to admin dashboard
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  }

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  }

  return (
    <div className='container' style={{ minHeight: "100vh" }}>
      <h1 className='text-center'>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input 
            type="email" 
            className="form-control" 
            id="email"
            name='email' 
            value={credentials.email} 
            onChange={onChange}
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            id="password"
            name='password' 
            value={credentials.password} 
            onChange={onChange}
            minLength={6}
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
        <Link to="/createadmin" className='m-3 btn btn-success'>New Admin</Link>
        <div className="mt-2">
          <Link to="/forgotpasswordadmin" className="text-primary">Forgot Password?</Link>
        </div>

        {errors.length > 0 && (
          <div className="alert alert-danger mt-3">
            <ul className="mb-0">
              {errors.map((error, index) => (
                <li key={index}>{error.msg}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}
