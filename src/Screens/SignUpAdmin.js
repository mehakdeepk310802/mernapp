import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
  //console.log("SignUp component is rendering...");
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", geolocation: "" });
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/createadmin", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          location: credentials.geolocation
        })
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        setErrors(json.errors || []);
        alert("Enter Valid Credentials");
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      console.log(json);
      alert("User created successfully!");
      setCredentials({ name: "", email: "", password: "", geolocation: "" }); // Reset form on success

    } catch (error) {
      console.error('Failed to fetch:', error);
      alert(`Failed to fetch data. Error: ${error.message}`);
    }
  };

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <div className="container" style={{minHeight: "100vh" }}>
      <h1 className='text-center'>Admin SignUp</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" value={credentials.name} onChange={onChange} />
          {errors.find(error => error.path === 'name') && (
            <div className="form-text text-danger">
              {errors.find(error => error.path === 'name').msg}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name="email" value={credentials.email} aria-describedby="emailHelp" onChange={onChange} />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          {errors.find(error => error.path === 'email') && (
            <div className="form-text text-danger">
              {errors.find(error => error.path === 'email').msg}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange} />
          {errors.find(error => error.path === 'password') && (
            <div className="form-text text-danger">
              {errors.find(error => error.path === 'password').msg}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="geolocation" className="form-label">Address</label>
          <input type="text" className="form-control" id="geolocation" name="geolocation" value={credentials.geolocation} onChange={onChange} />
        </div>

        <button type="submit" className="btn btn-success">Submit</button>
        <Link to="/login" className='m-3 btn btn-danger'>Already an Admin?</Link>
      </form>
    </div>
  );
}
