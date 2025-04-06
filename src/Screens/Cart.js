import React from 'react';
import Delete from '@mui/icons-material/Delete';
import { useCart, useDispatchCart } from '../components/ContextReducer';

export default function Cart() {
  let data = useCart();
  let dispatch = useDispatchCart();

  if (data.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          height: '60vh',
          backgroundColor: '#1e1e1e',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <div>
          <h2 className="mb-4">🛒 The Cart is Empty!</h2>
          <button
            className="btn btn-outline-light"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleCheckOut = async () => {
    let userEmail = localStorage.getItem("userEmail");
    try {
      let response = await fetch("http://localhost:5000/api/orderData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_data: data,
          email: userEmail,
          order_date: new Date().toDateString()
        })
      });

      if (response.ok) {
        let result = await response.json();
        if (result.success) {
          dispatch({ type: "DROP" });
        } else {
          console.error('Checkout failed:', result);
        }
      } else {
        console.error('Response was not ok:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to checkout:', error);
    }
  };

  let totalPrice = data.reduce((total, food) => total + food.price, 0);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">🧾 Your Cart</h2>
      <div className="table-responsive shadow rounded">
        <table className="table table-hover align-middle">
          <thead className="table-success text-center">
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Size</th>
              <th>Amount (₹)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {data.map((food, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price}</td>
                <td>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => dispatch({ type: "REMOVE", index })}
                  >
                    <Delete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4 px-2">
        <h4>Total Price: ₹{totalPrice}</h4>
        <button className="btn btn-success px-4 py-2" onClick={handleCheckOut}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
