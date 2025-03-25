import express from 'express';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { mail } from '../util/mail.js';
const jwtSecret = "MynameisEndToEndYouTubeChannel$#"
const router = express.Router();
router.post("/createuser", [
    // Add input validation
    body('email').isEmail(),
    body('name').isLength({ min: 3 }),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ success: false, message: 'Enter Valid Credentials' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const setPassword = await bcrypt.hash(req.body.password, salt);
    
    try {
        // Create the user
        const newUser = await User.create({
            name: req.body.name,
            password: setPassword,
            email: req.body.email,
            location: req.body.location
        });

        // Generate auth token for automatic login
        const data = {
            user: {
                id: newUser.id
            }
        }
        const authToken = jwt.sign(data, jwtSecret);
        
        // Return success with auth token
        return res.json({ 
            success: true, 
            authToken: authToken,
            user: {
                name: newUser.name,
                email: newUser.email,
                location: newUser.location
            }
        });

    } catch (err) {
        console.error('Error creating user:', err);
        if (err.code === 11000) { // MongoDB duplicate key error
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists with this email' 
            });
        }
        return res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});
router.post("/loginuser", [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ 
            success: false, 
            message: 'Enter Valid Credentials' 
        });
    } 

    const email = req.body.email;
    try {
        const userData = await User.findOne({email});
        if(!userData){
            return res.status(400).json({
                success: false, 
                message: "Invalid email or password"
            });
        }

        const pwdCompare = await bcrypt.compare(req.body.password, userData.password);
        if(!pwdCompare){
            return res.status(400).json({
                success: false, 
                message: "Invalid email or password"
            });
        }

        // Generate access token (short-lived)
        const accessToken = jwt.sign(
            { user: { id: userData.id } },
            jwtSecret,
            { expiresIn: '15m' } // Access token expires in 15 minutes
        );

        // Generate refresh token (long-lived)
        const refreshToken = crypto.randomBytes(40).toString('hex');
        const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        // Save refresh token to user document
        userData.refreshToken = refreshToken;
        userData.refreshTokenExpiry = refreshTokenExpiry;
        await userData.save();
        
        return res.json({ 
            success: true, 
            accessToken: accessToken,
            refreshToken: refreshToken,
            refreshTokenExpiry: refreshTokenExpiry,
            user: {
                name: userData.name,
                email: userData.email,
                location: userData.location
            }
        });

    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});
router.post("/forgotpassword", [body('email').isEmail()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Enter a valid email' });
    }

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Generate a token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = await bcrypt.hash(resetToken, 10);

        // Store the hashed token in the database (temporary field)
        user.resetToken = hashedToken;
        user.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        // Send email with reset link
        const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;
        mail(resetUrl, user.email);
        return res.json({ success: true, message: "Password reset link sent to email" });
    } 
    catch (err) {
        console.error('Error in forgot password:', err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Route to reset the password
// Reset Password Route
router.post("/resetpassword/:token", [
    body('password').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters long' 
            });
        }

        const password = req.body.password;
        const receivedToken = req.params.token;

        // Find user by comparing hashed tokens
        const users = await User.find({ resetToken: { $exists: true } });
        let user = null;
        
        // Manually check each user's token
        for (let currentUser of users) {
            const isValidToken = bcrypt.compare(receivedToken, currentUser.resetToken);
            if (isValidToken && currentUser.resetTokenExpiry > Date.now()) {
                user = currentUser;
                break;
            }
        }

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "Password reset link has expired or is invalid" 
            });
        }

        // Update password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear the reset token fields
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        // Generate new auth token for automatic login
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, jwtSecret);

        return res.json({ 
            success: true, 
            message: "Password reset successful",
            authToken: authToken,
            user: {
                name: user.name,
                email: user.email,
                location: user.location
            }
        });

    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
});
export default router;