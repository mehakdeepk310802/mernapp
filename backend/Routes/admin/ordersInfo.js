import { Router } from 'express';
import Order from '../../models/Orders.js';

const router = Router();

// Route to get all orders
router.get('/getOrders', async (req, res) => {
    try {
        const orders = await Order.find({})

        res.json({ success: true, orders: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error fetching orders' });
    }
});

export default router;