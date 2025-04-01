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

        const { name, email } = req.body;
        const updates = {};
        
        if (name) updates.name = name;
        
        if (email) {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }
            
            // Check if email already exists for another user
            const existingUser = await User.findOne({ 
                email, 
                _id: { $ne: req.params.id } 
            });
            
            if (existingUser) {
                return res.status(409).json({ 
                    success: false,
                    message: 'Email already in use by another user' 
                });
            }
            
            updates.email = email;
        }

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
        
        // Handle specific MongoDB errors
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists',
                error: 'Duplicate email address'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
});

export default router;