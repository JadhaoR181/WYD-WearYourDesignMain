import React, { useEffect, useState } from 'react';
import './Dashboard.css'; // Import your CSS file for styles

const Dashboard = () => {
  const [data, setData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/dashboard');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="cards">
        <div className="card">
          <h3>Total Products</h3>
          <p>{data.totalProducts}</p>
        </div>
        <div className="card">
          <h3>Total Orders</h3>
          <p>{data.totalOrders}</p>
        </div>
        <div className="card">
          <h3>Total Users</h3>
          <p>{data.totalUsers}</p>
        </div>
        <div className="card">
          <h3>Total Revenue</h3>
          <p>${data.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
