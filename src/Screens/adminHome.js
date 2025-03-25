import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminHome = () => {
    const [totalOrders, setTotalOrders] = useState(0);
    const [registeredUsers, setRegisteredUsers] = useState(0);
    const [salesRevenue, setSalesRevenue] = useState(0);

    useEffect(() => {
        // Fetch data from your API and update the state
        setTotalOrders(120);
        setRegisteredUsers(2388);
        setSalesRevenue(492000); // Example in rupees
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                {/* Registered Users Card */}
                <div className="col-md-4">
                    <div className="card text-white bg-dark shadow">
                        <div className="card-body text-center">
                            <h5 className="card-title">Registered Users</h5>
                            <h2>{registeredUsers}</h2>
                        </div>
                    </div>
                </div>

                {/* Total Orders Card */}
                <div className="col-md-4">
                    <div className="card text-white bg-primary shadow">
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Orders</h5>
                            <h2>{totalOrders}</h2>
                        </div>
                    </div>
                </div>

                {/* Total Earnings Card */}
                <div className="col-md-4">
                    <div className="card text-white bg-success shadow">
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Earnings</h5>
                            <h2>₹{salesRevenue}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
