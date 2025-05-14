import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();
router.post('/sendStatusEmail', async (req, res) => {
    const { email, status, orderId } = req.body;

    if (!email || !status || !orderId) {
        return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    try {
        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mehakdeepk419@gmail.com',
                pass: 'cyhoptuscjihhnhh'
            }
        });
        const mailOptions = {
            from: 'mehakdeepk419@gmail.com',
            to: email,
            subject: `Order ${orderId} Status Update`,
            html: `<p>Your order with ID <b>${orderId}</b> is now <b>${status}</b>.</p>`
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

export default router;
