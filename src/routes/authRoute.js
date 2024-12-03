// /routes/authRoute.js

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Route to generate a test JWT token
router.post('/auth/generate', (req, res) => {
  const user = { id: 11, username: 'Dana' }; // mock user data
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '3h' });
  res.json({ token });
});

module.exports = router;
