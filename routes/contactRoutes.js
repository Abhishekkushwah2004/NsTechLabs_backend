require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/contact', async (req, res) => {
    const { name, email, phone, message } = req.body;

    // ✅ configure transporter (Gmail used here)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,         // 👉 your Gmail
            pass: process.env.EMAIL_PASS,            // 👉 app-specific password (not Gmail login)
        },
    });

    // ✅ email content
    const mailOptions = {
        from: email,
        to: 'akushwaha2004@gmail.com', // 👉 your email to receive the message
        subject: `New Contact from ${name}`,
        html: `
      <h3>Contact Details</h3>
      <p><strong>Name:-</strong> ${name}</p>
      <p><strong>Email:-</strong> ${email}</p>
      <p><strong>Phone:-</strong> ${phone}</p>
      <p><strong>Message:-</strong> ${message}</p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', mailOptions);
        res.status(200).json({ success: true, message: 'Form submitted and email sent successfully!' });
    } catch (err) {
        console.error('❌ Email failed:', err);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
});

module.exports = router;
