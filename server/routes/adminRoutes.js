const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 1. GET ALL STUDENTS
router.get('/students', async (req, res) => {
  try {
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

// 3. DELETE USER (Fixes the persistence issue)
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