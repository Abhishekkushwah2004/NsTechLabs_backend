require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

// ✅ Create transporter ONCE (better performance)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    console.log("📥 Contact Body:", req.body);

    // ✅ Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // ✅ Email to Admin
    const mailOptions = {
      from: process.env.EMAIL_USER,   // ✅ FIXED
      to: 'abhiskushwah2004@gmail.com',
      replyTo: email,                 // ✅ user reply
      subject: `New Contact from ${name}`,
      html: `
        <h3>Contact Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log('✅ Contact email sent');

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully!',
    });

  } catch (err) {
    console.error('❌ Contact Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;