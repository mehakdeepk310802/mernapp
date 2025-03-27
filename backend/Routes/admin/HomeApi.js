import { Router } from 'express';
import Order from '../../models/Orders.js';
import User from '../../models/User.js';
const router = Router();

router.get('/getAllTotals', async (req, res) => {
    try {
        const ordersCount = await Order.countDocuments();
        const usersCount = await User.countDocuments();
        res.status(200).json({ totalOrders: ordersCount , totalUsers: usersCount});
    } catch (error) {
        console.error("Error getting orders:", error.message);
        res.status(500).json({ error: "Server Error" });
    }
});

export default router;