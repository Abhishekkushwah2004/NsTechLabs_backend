require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/proposal', async (req, res) => {
    console.log("📥 Incoming request body:", req.body);

    const { fullName, email, subject, mobile, message, budget, proposalOption } = req.body;

    // ✅ Configure transporter using Gmail + App Password
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,  // Your Gmail address
            pass: process.env.EMAIL_PASS   // App password (not your login password)
        }
    });

    // 📩 1) Email to YOU (admin / company)
    const adminMail = {
        from: process.env.EMAIL_USER,
        to: 'abhiskushwah2004@gmail.com',
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

    // 📩 2) Auto-reply to USER
    const userMail = {
        from: `"NS TechLabs" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Thank You for Reaching Out to NS TechLabs",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <body style="margin:0; padding:0; background:#f4f6fa; font-family:Arial,Helvetica,sans-serif;">
          <center style="width:100%; background:#f4f6fa; padding:20px 0;">
            <table width="100%" style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
              <tr>
                <td style="background:linear-gradient(135deg,#0b5fff,#0077ff); padding:25px; text-align:center; color:#ffffff;">
                  <h1 style="margin:0; font-size:24px; font-weight:700;">NS TechLabs</h1>
                  <p style="margin:6px 0 0; font-size:13px; opacity:0.9;">Innovating Reliable Web Solutions</p>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 24px; font-size:15px; line-height:24px; color:#333;">
                  <p>Hello <strong>${fullName}</strong>,</p>
                  <p>Thank you for contacting <strong>NS TechLabs</strong>. We’ve received your message/proposal and truly appreciate you taking the time to reach out.</p>
                  <p>Our team will carefully review your request and get back to you as soon as possible. In the meantime, if you’d like to share more details, please feel free to reply to this email.</p>
                  <p>We look forward to connecting with you!</p>
                  <p>Best regards,<br /><strong>The NS TechLabs Team</strong></p>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 24px; text-align:center; background:#f9fafc; font-size:13px; color:#666;">
                  <div style="margin-bottom:6px;">
                    🌐 <a href="https://www.nstechlabs.com" style="color:#0b5fff; text-decoration:none;">www.nstechlabs.com</a>
                  </div>
                  <div>
                    📧 <a href="mailto:support@nstechlabs.com" style="color:#0b5fff; text-decoration:none;">support@nstechlabs.com</a>
                  </div>
                </td>
              </tr>
            </table>
          </center>
        </body>
        </html>
        `
    };

    try {
        // Send both emails
        await transporter.sendMail(adminMail);
        await transporter.sendMail(userMail);

        console.log('✅ Both emails sent successfully');
        res.status(200).json({ success: true, message: 'Proposal submitted and emails sent!' });
    } catch (error) {
        console.error('❌ Email failed to send:', error);
        res.status(500).json({ success: false, message: 'Failed to send emails.' });
    }
});

module.exports = router;
