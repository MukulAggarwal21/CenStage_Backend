// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aggarwalmukul2194:CenStageIntern@censtagecluster.gd6igtm.mongodb.net/';

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/goals', require('./routes/goals'));
app.use('/api/events', require('./routes/events'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});