import React, { useState, useEffect } from "react";
import { Button, Table, Container, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    location: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/costumerInfo/allUsers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customer data');
      }

      const data = await response.json();
      setCustomers(data.users);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/costumerInfo/deleteUser/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        setCustomers(prevCustomers => prevCustomers.filter(customer => customer._id !== id));
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setEditForm({
      name: customer.name || '',
      email: customer.email || '',
      location: customer.location || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/costumerInfo/updateUser/${editingCustomer._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update customer');
      }

      const data = await response.json();

      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer._id === editingCustomer._id 
            ? { ...customer, ...editForm }
            : customer
        )
      );

      setShowEditModal(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update customer');
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Error: {error}
          <Button className="ms-3" onClick={fetchCustomers}>Retry</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <h2 className="text-center mb-4">Customer Management</h2>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="bg-primary text-white">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.location || 'N/A'}</td>
                <td>
                  {customer.date ? new Date(customer.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'N/A'}
                </td>
                <td>
                  <Button 
                    variant="warning" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEdit(customer)}
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(customer._id)}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      
      {customers.length === 0 && (
        <Alert variant="info" className="text-center mt-4">
          No customers found
        </Alert>
      )}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer</Modal.Title>
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
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CustomerManagement;