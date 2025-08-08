require('dotenv').config();
const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Prepare email content
        const msg = {
            to: 'akushwaha2021@nstechlabs.in', // Change to your receiving email
            from: 'contact@nstechlabs.in', // Must be verified in SendGrid
            subject: `New Contact Form Submission from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Phone: ${phone}
                Message: ${message}
            `,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Message:</strong> ${message}</p>
            `,
        };

        // Send email
        await sgMail.send(msg);

        // Respond to frontend
        res.status(200).json({ success: true, message: 'Email sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);

        if (error.response) {
            console.error(error.response.body);
        }

        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

module.exports = router;
