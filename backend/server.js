require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/transcriptionRoutes');

console.log('Starting backend server file...');

const app = express();

// CORS - allow your frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Set your frontend URL in Render
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

console.log('Connecting to MongoDB...');
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/innovexis';

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error(' MongoDB connection error:', err);
    process.exit(1);
  });

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

app.use('/api/transcriptions', routes);

// Use environment PORT or default to 5000 for local
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});