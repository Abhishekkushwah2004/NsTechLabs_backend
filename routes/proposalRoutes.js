require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/proposal', async (req, res) => {
    console.log("📥 Incoming request body:", req.body);

    const { fullName, email, subject, mobile, message, budget, proposalOption } = req.body;

    const formData = {
        fullName,
        email,
        subject,
        mobile,
        message,
        budget,
        proposalOption
    };

    // ✅ Configure transporter using Gmail + App Password
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,  // Your Gmail address
            pass: process.env.EMAIL_PASS   // App password (not your login password)
        }
    });

    const mailOptions = {
        from: email,
        to: 'akushwaha2021@nstechlabs.in',
        subject: `New Proposal Request from ${fullName}`,
        html: `
            <h2>Proposal Request Details</h2>
            <p><strong>Full Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mobile:</strong> ${mobile}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Proposal Option:</strong> ${proposalOption}</p>
            <p><strong>Budget:</strong> ${budget} USD</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully');
        res.status(200).json({ success: true, message: 'Proposal submitted and email sent!' });
    } catch (error) {
        console.error('❌ Email failed to send:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
});

module.exports = router;
