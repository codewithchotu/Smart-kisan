const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_kisan', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));
// Routes
const authRoutes = require('./routes/auth');
const analyzeRoutes = require('./routes/analyze');
const historyRoutes = require('./routes/history');
const insightsRoutes = require('./routes/insights');
const marketRoutes = require('./routes/market');
const weatherRoutes = require('./routes/weather');
const schemesRoutes = require('./routes/schemes');
const alertsRoutes = require('./routes/alerts');

app.use('/api/auth', authRoutes);
app.use('/api', analyzeRoutes);
app.use('/api', historyRoutes);
app.use('/api', insightsRoutes);
app.use('/api', marketRoutes);
app.use('/api', weatherRoutes);
app.use('/api', schemesRoutes);
app.use('/api/alerts', alertsRoutes);

// Schedule daily weather updates
cron.schedule('0 6 * * *', () => {
  console.log('Fetching daily weather updates...');
  // Implement weather fetch logic
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});