import express from 'express';
const router = express.Router();
router.post('/foodData', (req, res) => {
    try {
        res.status(200).json({
            food_items: global.food_items,
            foodCategory: global.foodCategory
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
});
router.post('/customerData', (req, res) => {
    try {
        res.status(200).json({
            email: global.email,
            name: global.name,
            location: global.location
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
});
export default router;
