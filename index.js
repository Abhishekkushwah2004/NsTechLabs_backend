require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
const contactRoutes = require('./routes/contactRoutes');
const proposalRoutes = require('./routes/proposalRoutes');

app.use('/contact', contactRoutes);
app.use('/contact', proposalRoutes);

// ✅ Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});