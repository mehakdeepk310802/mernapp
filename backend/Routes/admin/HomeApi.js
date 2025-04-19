import { Router } from 'express';
import Order from '../../models/Orders.js';
import User from '../../models/User.js';

const router = Router();

router.get('/getAllTotals', async (req, res) => {
    try {
        const ordersCount = await Order.countDocuments();
        const usersCount = await User.countDocuments();
        const orders = await Order.find(); // Get all orders

        let totalEarnings = 0;

        for (const order of orders) {
            const orderData = order.order_data;
            if (!Array.isArray(orderData)) continue;

            for (const subOrder of orderData) {
                if (!Array.isArray(subOrder)) continue;

                for (const item of subOrder) {
                    // Skip Order_date objects
                    if (item?.price && item?.qty) {
                        totalEarnings += item.price * Number(item.qty);
                    }
                }
            }
        }

        res.status(200).json({  
            totalOrders: ordersCount,
            totalUsers: usersCount,
            totalEarnings: totalEarnings,
        });

    } catch (error) {
        console.error("Error getting totals:", error.message);
        res.status(500).json({ error: "Server Error" });
    }
});

export default router;
