require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

// ✅ Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/proposal', async (req, res) => {
  try {
    console.log("📥 Proposal Body:", req.body);

    const {
      fullName,
      email,
      subject,
      mobile,
      message,
      budget,
      proposalOption
    } = req.body;

    // ✅ Validation
    if (!fullName || !email || !message) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // 📩 Admin Email
    const adminMail = {
      from: process.env.EMAIL_USER,
      to: 'abhiskushwah2004@gmail.com',
      replyTo: email,
      subject: `New Proposal from ${fullName}`,
      html: `
        <h2>Proposal Request</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile || 'N/A'}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Option:</strong> ${proposalOption || 'N/A'}</p>
        <p><strong>Budget:</strong> ${budget || 'N/A'} USD</p>
      `,
    };

    // 📩 User Auto Reply
    const userMail = {
      from: `"NS TechLabs" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thanks for contacting NS TechLabs",
      html: `
        <h3>Hello ${fullName},</h3>
        <p>We received your proposal. Our team will contact you soon.</p>
        <p>Thanks,<br/>NS TechLabs</p>
      `,
    };

    // ✅ Send mails safely
    await transporter.sendMail(adminMail);

    try {
      await transporter.sendMail(userMail);
    } catch (err) {
      console.log("⚠️ User mail failed:", err.message);
    }

    console.log('✅ Proposal emails sent');

    res.status(200).json({
      success: true,
      message: 'Proposal submitted successfully!',
    });

  } catch (error) {
    console.error('❌ Proposal Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;