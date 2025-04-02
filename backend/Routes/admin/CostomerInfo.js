import express from 'express';
import User from '../../models/User.js';
const router = express.Router();

router.get('/allUsers', async (req, res) => {
    try {
        const users = (await User.find({})) || [];
        res.json({"users":users});
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
});

router.put('/updateUser/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const { name, email, location } = req.body;
        const updates = {};
        
        if (name) updates.name = name;
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }
            updates.email = email;
        }
        if (location) updates.location = location;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            success: true,
            data: user,
            message: 'User updated successfully'
        });

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating user',
            error: error.message 
        });
    }
});

router.delete('/deleteUser/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
});
export default router;