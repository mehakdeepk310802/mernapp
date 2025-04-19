import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminHome = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [registeredUsers, setRegisteredUsers] = useState(0);
  const [salesRevenue, setSalesRevenue] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/home/getAllTotals', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalOrders(data.totalOrders);
        setRegisteredUsers(data.totalUsers);
        setSalesRevenue(data.totalEarnings); // static for now
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  // Chart 1: Orders + Earnings
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Orders',
        data: [2, 4, 1, 5, totalOrders],
        backgroundColor: '#007bff',
        borderRadius: 4,
      },
      {
        label: 'Earnings (₹)',
        data: [2000, 3000, 1500, 4000, salesRevenue],
        backgroundColor: '#28a745',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Chart 2: User Growth
  const userChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Registered Users',
        data: [
          Math.floor(registeredUsers * 0.1),
          Math.floor(registeredUsers * 0.2),
          Math.floor(registeredUsers * 0.2),
          Math.floor(registeredUsers * 0.2),
          registeredUsers -
            (Math.floor(registeredUsers * 0.1) +
              Math.floor(registeredUsers * 0.2) * 3),
        ],
        backgroundColor: '#343a40',
        borderRadius: 4,
      },
    ],
  };

  const userChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Chart 3: Total Earnings Over Months
  const earningsChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Earnings (₹)',
        data: [1000, 2000, 3000, 4000, salesRevenue],
        backgroundColor: '#ffc107',
        borderRadius: 4,
      },
    ],
  };

  const earningsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="container mt-4">
      {/* Stat Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-dark shadow">
            <div className="card-body text-center">
              <h5 className="card-title">Registered Users</h5>
              <h2>{registeredUsers}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-primary shadow">
            <div className="card-body text-center">
              <h5 className="card-title">Total Orders</h5>
              <h2>{totalOrders}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-success shadow">
            <div className="card-body text-center">
              <h5 className="card-title">Total Earnings</h5>
              <h2>₹{salesRevenue}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row (3 in a row) */}
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow p-3 mb-4">
            <h5 className="text-center">Performance Overview</h5>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow p-3 mb-4">
            <h5 className="text-center">User Growth Overview</h5>
            <Bar data={userChartData} options={userChartOptions} />
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow p-3 mb-4">
            <h5 className="text-center">Earnings Overview</h5>
            <Bar data={earningsChartData} options={earningsChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
