import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminInfo = () => {
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await fetch('/api/admin/allAdmins'); // Adjust the URL as needed
        const data = await response.json();
        setAdminInfo(data.admin);
      } catch (error) {
        console.error('Error fetching admin info:', error);
      }
    };

    fetchAdminInfo();
  }, []);

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">Admin Information</h2>
        {adminInfo ? (
          <div>
            <p><strong>Name:</strong> {adminInfo.name}</p>
            <p><strong>Email:</strong> {adminInfo.email}</p>
            <p><strong>Location:</strong> {adminInfo.location}</p>
            <p><strong>DateOfJoining</strong> {adminInfo.Date}</p>
            {/* Add more fields as needed */}
          </div>
        ) : (
          <p>Loading admin information...</p>
        )}
      </div>
    </div>
  );
};

export default AdminInfo;