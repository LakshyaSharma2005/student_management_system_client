const express = require('express');
const router = express.Router();
const { getStudentProfile, getAttendance } = require('../controllers/studentController');

// Define the routes
router.get('/profile', getStudentProfile);
router.get('/attendance', getAttendance); // This matches your frontend call!

module.exports = router;