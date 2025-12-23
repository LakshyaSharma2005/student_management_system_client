const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// 1. Register Route
router.post('/register', register);

// 2. Login Route (THIS MUST POINT TO THE CONTROLLER)
router.post('/login', login);

module.exports = router;