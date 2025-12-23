const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER
exports.register = async (req, res) => {
    try {
        // 🆕 Extract new fields (course, subject, fees) from request
        const { name, email, password, role, course, subject, fees } = req.body;
        
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: "User already exists" });

        // Manual Hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 🆕 Create User with ALL fields
        user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || 'Student',
            course,   // Saves course (e.g., B.Tech)
            subject,  // Saves subject (e.g., Physics)
            fees      // Saves fees status (e.g., Paid)
        });
        
        await user.save();
        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ success: false, message: "Registration failed" });
    }
};

// 2. LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`\n--- Login Attempt: ${email} ---`);

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ Result: User not found in DB");
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        // Check password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Result: Password Mismatch");
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        // Generate Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: '24h' }
        );

        console.log(`✅ Result: Success! Role: ${user.role}`);

        res.status(200).json({
            success: true,
            token,
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email,
                role: user.role,
                course: user.course // Optional: Send back course details on login
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};