import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
} from '@mui/material';
import { green, grey } from '@mui/material/colors';

export default function OrderAdmin() {
  const [orderData, setOrderData] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [orderStatus, setOrderStatus] = useState({});
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/ordersInfo/getOrders');
        const data = await response.json();

        if (data.success && data.orders) {
          setOrderData(data);
          const uniqueEmails = [...new Set(data.orders.map(order => order.email))];
          setEmails(uniqueEmails);
          if (uniqueEmails.length > 0) setSelectedEmail(uniqueEmails[0]);
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (orderId, newStatus, email) => {
    setOrderStatus(prev => ({ ...prev, [orderId]: newStatus }));

    // Send email using your backend API
    try {
      const res = await fetch('http://localhost:4000/api/admin/sendStatusEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          status: newStatus,
          orderId: orderId,
        }),
      });

      const responseJson = await res.json();
      console.log('Email API response:', responseJson);
    } catch (error) {
      console.error('Failed to send status email:', error);
    }
  };

  const statusButtons = ["Cooking", "Prepared", "Out for Delivery", "Delivered"];
  const selectedOrders = orderData?.orders?.filter(order => order.email === selectedEmail);

  return (
      <Box sx={{ bgcolor: grey[100], minHeight: '100vh' }}>
        <AppBar position="static" sx={{ bgcolor: green[700] }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Mr.Foody
            </Typography>
            <Button color="inherit">Home</Button>
            <Button color="inherit">Orders Admin</Button>
            <Button color="inherit">Logout</Button>
          </Toolbar>
        </AppBar>

        <Container sx={{ py: 4 }}>
          {emails.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Select Customer</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {emails.map((email, idx) => (
                      <Chip
                          key={idx}
                          label={email}
                          onClick={() => setSelectedEmail(email)}
                          color={selectedEmail === email ? 'success' : 'default'}
                          clickable
                      />
                  ))}
                </Box>
              </Box>
          )}

          {selectedOrders?.map((order, orderIdx) =>
              order.order_data.map((group, groupIndex) => {
                const orderDate = group[0].Order_date;
                const items = group.slice(1);
                const orderId = `${order._id}-${groupIndex}`;
                const currentStatus = orderStatus[orderId] || "Cooking";

                return (
                    <Box key={`${orderIdx}-${groupIndex}`} sx={{ mb: 6 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">{selectedEmail}</Typography>
                        <Typography variant="body2" color="text.secondary">Order Date: {orderDate}</Typography>
                      </Box>

                      <ToggleButtonGroup
                          value={currentStatus}
                          exclusive
                          onChange={(e, newStatus) => {
                            if (!newStatus) return;
                            handleStatusChange(orderId, newStatus, selectedEmail);
                          }}
                          sx={{ mb: 3 }}
                      >
                        {statusButtons.map(status => (
                            <ToggleButton key={status} value={status}>
                              {status}
                            </ToggleButton>
                        ))}
                      </ToggleButtonGroup>

                      <Grid container spacing={3}>
                        {items.map((item, i) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                              <Card sx={{ height: '100%' }}>
                                <CardMedia
                                    component="img"
                                    height="160"
                                    image="https://via.placeholder.com/400x300"
                                    alt={item.name}
                                />
                                <CardContent>
                                  <Typography variant="h6">{item.name}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {item.qty} {item.size} — ₹{item.price}/-
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                        ))}
                      </Grid>
                    </Box>
                );
              })
          )}

          {!orderData && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">Loading order data...</Typography>
              </Box>
          )}

          {!(selectedOrders?.length || !orderData || !(
              <Box sx={{textAlign: 'center', py: 4}}>
                <Typography color="text.secondary">No orders found for the selected customer.</Typography>
              </Box>
          ))}
        </Container>
      </Box>
  );
}
