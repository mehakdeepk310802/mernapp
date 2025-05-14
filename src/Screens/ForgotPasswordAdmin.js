import React, { useState } from 'react';

export default function ForgotPassword() {
  console.log("ForgotPassword component is rendering!");
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with email:", email);
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/admin/forgotpasswordadmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      setMessage('Password reset link sent! Check your email.');
    } catch (error) {
      setError(error.message);
      console.error("Error during password reset:", error); // Debugging line
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: "100vh" }}>
      <h2>Forgot Password Admin</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Enter your email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-danger" disabled={loading}>
          {loading ? 'Sending...' : 'Reset Password'}
        </button>
      </form>

      {message && <div className="alert alert-success mt-3">{message}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
