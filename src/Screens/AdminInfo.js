import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminInfo = () => {
  const [adminInfo, setAdminInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/allAdmins', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch admin data');
        return response.json();
      })
      .then((data) => {
        setAdminInfo(data.admins || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Information</h2>
      <div className="row d-flex flex-wrap justify-content-center gap-3">
        {adminInfo.map((admin, index) => (
          <div key={admin._id || index} className="col-md-4">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">Admin #{index + 1}</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-6">
                    <h6 className="text-muted">Personal Info</h6>
                    <p><strong>Name:</strong> {admin.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {admin.email || 'N/A'}</p>
                  </div>
                  <div className="col-6">
                    <h6 className="text-muted">Additional Details</h6>
                    <p><strong>Location:</strong> {admin.location || 'N/A'}</p>
                    <p><strong>Joining Date:</strong> {admin.Date ? new Date(admin.Date).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="card-footer bg-light d-flex justify-content-end gap-2">
                <button className="btn btn-warning">
                  <i className="bi bi-pencil me-1"></i> Edit
                </button>
                <button className="btn btn-danger">
                  <i className="bi bi-trash me-1"></i> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminInfo;