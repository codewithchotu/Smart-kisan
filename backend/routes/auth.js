const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = new User({ name, email, phone, password });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ success: true, token, user: { id: user._id, name, email, points: user.points } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email, points: user.points, badges: user.badges } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;