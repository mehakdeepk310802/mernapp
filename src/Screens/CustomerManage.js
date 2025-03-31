import React, { useState } from "react";
import { Button, Table, Container } from "react-bootstrap";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", location: "New York", date: "2024-03-31" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", location: "Los Angeles", date: "2024-03-30" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", location: "Chicago", date: "2024-03-29" },
  ]);

  const handleDelete = (email) => {
    setCustomers(customers.filter((customer) => customer.email !== email));
  };

  const handleUpdate = (email) => {
    alert(`Update customer with Email: ${email}`);
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Customer Data</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.email}>
              <td className="px-4 py-3">{customer.name}</td>
              <td className="px-4 py-3">{customer.email}</td>
              <td className="px-4 py-3">{customer.location}</td>
              <td className="px-4 py-3">{customer.date}</td>
              <td className="px-4 py-3">
                <Button variant="success" className="me-3" onClick={() => handleUpdate(customer.email)}>
                  Update
                </Button>
                <Button variant="danger" onClick={() => handleDelete(customer.email)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
export default CustomerManagement;