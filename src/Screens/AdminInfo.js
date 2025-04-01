import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminInfo = () => {
  const [adminInfo, setAdminInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    location: ''
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/allAdmins', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch admin data');
        }
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

  const handleEdit = (adminId) => {
    const admin = adminInfo.find(a => a._id === adminId);
    if (admin) {
      setEditingAdmin(admin);
      setEditForm({
        name: admin.name || '',
        email: admin.email || '',
        location: admin.location || ''
      });
      setShowEditModal(true);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/updateAdmin/${editingAdmin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update admin');
      }

      const data = await response.json();
      
      setAdminInfo(adminInfo.map(admin => 
        admin._id === editingAdmin._id ? { ...admin, ...editForm } : admin
      ));
      
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating admin:', error);
      alert('Failed to update admin');
    }
  };

  const handleDelete = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/deleteAdmin/${adminId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete admin');
        }

        setAdminInfo(adminInfo.filter(admin => admin._id !== adminId));
      } catch (error) {
        console.error('Error deleting admin:', error);
        alert('Failed to delete admin');
      }
    }
  };

  const EditModal = () => (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Admin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              value={editForm.location}
              onChange={(e) => setEditForm({...editForm, location: e.target.value})}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleEditSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Information</h2>
      <div className="row">
        {adminInfo.map((admin, index) => (
          <div key={admin._id || index} className="col-12 d-flex mb-4">
            <div className="card shadow flex-grow-1">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">Admin #{index + 1}</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-muted">Personal Information</h6>
                    <p><strong>Name:</strong> {admin.name || 'Sayam'}</p>
                    <p><strong>Email:</strong> {admin.email || 'N/A'}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted">Additional Details</h6>
                    <p><strong>Location:</strong> {admin.location || 'N/A'}</p>
                    <p><strong>Date of Joining:</strong> {admin.Date ? new Date(admin.Date).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="card-footer bg-light">
                <div className="d-flex justify-content-end gap-2">
                  <button 
                    className="btn btn-warning" 
                    onClick={() => handleEdit(admin._id)}
                  >
                    <i className="bi bi-pencil me-1"></i> Edit
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(admin._id)}
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <EditModal />
    </div>
  );
};

export default AdminInfo;