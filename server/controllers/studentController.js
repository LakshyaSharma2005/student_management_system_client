const User = require('../models/User');

// 1. Get Student Profile
exports.getStudentProfile = async (req, res) => {
  try {
    // In a real app, you'd use req.user.id from the token
    // For now, let's just return a success message or dummy data
    res.status(200).json({ message: "Student profile loaded" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. Get Student Attendance (Fixes the 404 Error)
exports.getAttendance = async (req, res) => {
  try {
    // Sending dummy data so the frontend doesn't crash
    const attendanceData = [
      { date: '2025-12-01', status: 'Present', subject: 'Math' },
      { date: '2025-12-02', status: 'Absent', subject: 'Physics' },
      { date: '2025-12-03', status: 'Present', subject: 'Math' }
    ];
    
    res.status(200).json(attendanceData);
  } catch (err) {
    res.status(500).json({ message: "Server Error fetching attendance" });
  }
};