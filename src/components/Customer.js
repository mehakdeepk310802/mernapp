import React from 'react';
import Home from '../Screens/Home.js';
import Login from '../Screens/Login.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap-dark-5/dist/css/bootstrap-dark.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import SignUp from '../Screens/SignUp.js';
import { CartProvider } from './ContextReducer.js';
import MyOrder from '../Screens/MyOrder.js';
import Navbar from './navbar';
import ForgotPassword from '../Screens/ForgotPasswordUser.js';
import ResetPassword from '../Screens/ResetPasswordUser.js';
function Customer() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <div style={{ paddingTop: "100rem" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/createuser" element={<SignUp />} />
            <Route path="/myOrder" element={<MyOrder />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default Customer;
