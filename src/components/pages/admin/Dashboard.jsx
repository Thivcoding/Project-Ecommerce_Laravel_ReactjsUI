import React from 'react';

const Dashboard = () => {

  return (
     <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Products</p>
          <h2 className="text-3xl font-bold">120</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Orders</p>
          <h2 className="text-3xl font-bold">89</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Users</p>
          <h2 className="text-3xl font-bold">45</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

