const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// 1. GET ALL STUDENTS
router.get('/students', async (req, res) => {
  try {
    // Fetch all users with role 'Student'
    // We do NOT use .select() so it returns ALL fields (including course & fees)
    const students = await User.find({ role: 'Student' }).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error fetching students" });
  }
});

// 2. GET ALL TEACHERS
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await User.find({ role: 'Teacher' }).sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error fetching teachers" });
  }
});

// 3. DELETE USER
router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error deleting user" });
  }
});

module.exports = router;