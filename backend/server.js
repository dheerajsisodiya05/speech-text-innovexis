require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/transcriptionRoutes');

console.log('Starting backend server file...');

const app = express();
app.use(cors());
app.use(express.json());

console.log('Connecting to MongoDB...');
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/innovexis';
mongoose.connect(mongoUri).then(()=> console.log('Mongoose connected')).catch(err=> {console.error('Mongoose connect error:', err); process.exit(1);});

app.use('/api/transcriptions', routes);

app.listen(5000, () => console.log('Server running on 5000'));
