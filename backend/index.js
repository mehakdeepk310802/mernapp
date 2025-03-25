import express from 'express';
import mongoDB from './db.js';
import userRoutes from './Routes/CreateUser.js';
import displayData from './Routes/DisplayData.js';
import orderData from './Routes/OrderData.js';
import cors from 'cors';
import adminRoute from './Routes/admin/CreateAdmin.js';
import homeRoutes from './Routes/admin/HomeAPi.js';
const app = express();
const port = 5000;

// Connect to MongoDB
mongoDB();

// Middleware to enable CORS
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());
// Admin Apis
app.use("/api/admin",adminRoute);
app.use('/api/admin/home', homeRoutes);
// Normal Apis
app.use('/api', userRoutes);
app.use('/api', displayData);
app.use('/api', orderData);
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
