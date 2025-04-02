import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: ""});
  const [errors, setErrors] = useState([]);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/admin/createadmin", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const json = await response.json();
      
      if (!response.ok || !json.success) {
        setErrors(json.errors || []);
        alert(json.message || "Enter Valid Credentials");
        return;
      }

      if (json.success) {
        // Store auth token and user info
        localStorage.setItem("authToken", json.authToken);
        localStorage.setItem("userEmail", credentials.email);
        localStorage.setItem("userName", json.user.name);
        localStorage.setItem("userLocation", json.user.location);

        alert("Admin created successfully");
        navigate("/");
      }
    } catch (error) {
      console.error('Failed to create admin:', error);
      alert(`Failed to create admin. Error: ${error.message}`);
    }
  }

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  }

  return (
    <>
      <div className='container' style={{minHeight: "100vh"}}>
        <h1 className='text-center'>Create Admin Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input 
              type="text" 
              className="form-control" 
              name='name' 
              value={credentials.name || ''} 
              onChange={onChange} 
              minLength={3}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input 
              type="email" 
              className="form-control" 
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
              name='password' 
              value={credentials.password} 
              onChange={onChange}
              minLength={6}
              required 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">Location</label>
            <input 
              type="text" 
              className="form-control" 
              name='location' 
              value={credentials.location || ''} 
              onChange={onChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">Create Admin</button>
          <Link to="/adminlogin" className='m-3 btn btn-secondary'>Back to Login</Link>
        </form>

        {errors.length > 0 && (
          <div className="mt-3 alert alert-danger">
            <ul className="mb-0">
              {errors.map((error, index) => (
                <li key={index}>{error.msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
