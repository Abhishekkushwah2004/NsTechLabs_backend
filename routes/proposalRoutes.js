import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));

app.post("/contact/proposal", async (req, res) => {
  const { fullName, email, subject, mobile, budget, proposalOption, message } =
    req.body;

  if (!fullName || !email || !subject || !mobile || !message) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Proposal Request: ${subject}`,
      text: `
Name: ${fullName}
Email: ${email}
Mobile: ${mobile}
Budget: ${budget}
Proposal Option: ${proposalOption}
Message: ${message}
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Proposal sent successfully!" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ message: "Failed to send proposal" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
