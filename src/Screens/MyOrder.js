import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/navbar';

export default function MyOrder() {
    const [orderData, setOrderData] = useState({});

    const fetchMyOrder = async () => {
        const email = localStorage.getItem('userEmail');
        try {
            const res = await fetch("http://localhost:5000/api/myOrderData", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            setOrderData(data);
        } catch (err) {
            console.error("Error fetching order data:", err);
        }
    };

    useEffect(() => {
        fetchMyOrder();
    }, []);

    return (
        <div>
            {/* Fixed Navbar */}
            <div>
                <Navbar />
            </div>

            {/* Add top padding to avoid overlapping with navbar */}
            <div className='container pt-5 mt-5'>
                {orderData.orderData?.order_data?.length ? (
                    orderData.orderData.order_data
                        .slice(0)
                        .reverse()
                        .map((order, orderIndex) => (
                            <div key={orderIndex}>
                                <div className='m-auto mt-5 fs-5 fw-bold'>
                                    {order[0]?.Order_date || order[1]?.Order_date || 'Order Date'}
                                    <hr />
                                </div>
                                <div className='row'>
                                    {order.map((item, index) => {
                                        if (item.Order_date) return null;
                                        return (
                                            <div
                                                className='col-12 col-md-6 col-lg-3 mb-3'
                                                key={index}
                                            >
                                                <div
                                                    className='card'
                                                    style={{ width: '16rem', maxHeight: '360px' }}
                                                >
                                                    <img
                                                        src={item.img}
                                                        className='card-img-top'
                                                        alt={item.name}
                                                        style={{ height: '120px', objectFit: 'fill' }}
                                                    />
                                                    <div className='card-body'>
                                                        <h5 className='card-title'>{item.name}</h5>
                                                        <div className='container w-100 p-0'>
                                                            <span className='m-1'>{item.qty}</span>
                                                            <span className='m-1'>{item.size}</span>
                                                            <div className='d-inline ms-2 h-100 w-20 fs-6'>
                                                                ₹{item.price}/-
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                ) : (
                    <div className='text-center mt-5'>No orders found.</div>
                )}
            </div>

            {/* Footer */}
            <div>
                <Footer />
            </div>
        </div>
    );
}
    