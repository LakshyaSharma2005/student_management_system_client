const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 1. ADD NEW STUDENT
exports.addStudent = async (req, res) => {
  try {
    const { name, email, password, course } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already registered" });

    // Hash Password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create student user
    const student = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "Student",
      course: course, // Matches the String type in our User model
    });

    res.status(201).json({ message: "Student added successfully", student });
  } catch (error) {
    console.error("Add Student Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 2. GET ALL STUDENTS
exports.getAllStudents = async (req, res) => {
  try {
    // Find all users where role is 'Student'
    const students = await User.find({ role: "Student" }).select("-password");
    res.status(200).json(students);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching students", error: error.message });
  }
};
