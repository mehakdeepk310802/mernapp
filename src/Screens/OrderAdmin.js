import React, { useState, useEffect } from 'react';

export default function OrderAdmin() {
  const [orderData, setOrderData] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [orderStatus, setOrderStatus] = useState({});
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    // You would fetch this from your backend in real use
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/ordersInfo/getOrders');
        const data = await response.json();
        
        if (data.success && data.orders) {
          setOrderData(data);
          // Extract unique emails
          const uniqueEmails = data.orders.map(order => order.email);
          setEmails(uniqueEmails);
          // Set default selected email
          if (uniqueEmails.length > 0) {
            setSelectedEmail(uniqueEmails[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    
    fetchData();
  }, []);

  const handleStatusChange = (orderId, status) => {
    setOrderStatus(prev => ({
      ...prev,
      [orderId]: status
    }));
    
    // In a real application, you would also update the status in your backend:
    // const updateStatus = async () => {
    //   await fetch('http://localhost:5000/api/admin/updateOrderStatus', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ orderId, status })
    //   });
    // };
    // updateStatus();
  };

  const statusButtons = ["Cooking", "Prepared", "Out for Delivery", "Delivered"];

  // Find the selected order
  const selectedOrder = orderData?.orders?.find(order => order.email === selectedEmail);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-8">Mr.Foody</h1>
            <nav className="flex">
              <a href="#" className="px-4 py-2">Home</a>
              <a href="#" className="px-4 py-2 font-medium bg-green-700 rounded">Orders Admin</a>
            </nav>
          </div>
          <div className="flex items-center">
            <button className="border border-white px-4 py-1 rounded font-medium">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        {/* Email Selector */}
        {emails.length > 0 && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-3">Select Customer:</h2>
            <div className="flex flex-wrap gap-2">
              {emails.map((email, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-md ${selectedEmail === email 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                  onClick={() => setSelectedEmail(email)}
                >
                  {email}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Orders Display */}
        {selectedOrder && selectedOrder.order_data.map((orderGroup, groupIndex) => {
          const orderDate = orderGroup[0].Order_date;
          const items = orderGroup.slice(1);
          const orderId = `${selectedOrder._id}-${groupIndex}`;
          const currentStatus = orderStatus[orderId] || "Cooking";
          
          return (
            <div key={groupIndex} className="mb-8">
              <div className="mb-2 flex justify-between items-center">
                <h2 className="text-xl font-bold">{selectedEmail}</h2>
                <div className="text-sm text-gray-600">
                  Order Date: {orderDate}
                </div>
              </div>
              
              {/* Status Buttons */}
              <div className="bg-white p-3 rounded-lg shadow mb-4">
                <div className="flex flex-wrap gap-2">
                  {statusButtons.map((status) => (
                    <button
                      key={status}
                      className={`px-4 py-2 rounded ${currentStatus === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'}`}
                      onClick={() => handleStatusChange(orderId, status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Food Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="/api/placeholder/400/300" 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg">{item.name}</h3>
                      <div className="flex items-center text-gray-700 mt-1">
                        <span>{item.qty} {item.size}</span>
                        <span className="ml-auto">₹{item.price}/-</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Loading or No Data States */}
        {!orderData && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading order data...</p>
          </div>
        )}
        
        {orderData && !selectedOrder && (
          <div className="text-center py-8">
            <p className="text-gray-600">No orders found for the selected customer.</p>
          </div>
        )}
      </div>
    </div>
  );
}