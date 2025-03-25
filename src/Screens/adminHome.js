import React, { useState, useEffect } from 'react';
const AdminHome = () => {
    const [totalOrders, setTotalOrders] = useState(0);
    const [salesRevenue, setSalesRevenue] = useState(0);
    const [customerInsights, setCustomerInsights] = useState([]);

    useEffect(() => {
        // Fetch data from your API and update the state
        // This is just a placeholder, replace with your actual data fetching logic
        setTotalOrders(120);
        setSalesRevenue(5000);
        setCustomerInsights([
            { name: 'John Doe', orders: 5 },
            { name: 'Jane Smith', orders: 3 },
        ]);
    }, []);

    return (
        <div>
            <div>
                <div class="card">
                    <div class="card-body">
                        <h2>Total Orders</h2>
                        <h2> {totalOrders}</h2>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h2>Sales Revenue</h2>
                        <h2> ${salesRevenue}</h2>
                    </div>
                </div>
            </div>
            <div>
                <h2>Customer Insights</h2>
                <ul>
                    {customerInsights.map((customer, index) => (
                        <li key={index}>
                            {customer.name}: {customer.orders} orders
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminHome;