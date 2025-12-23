const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, course, subject, fees } = req.body;
        
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User with specific fallbacks to ensure data is never null
        user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || 'Student',
            course: course || '',     
            subject: subject || '',   
            fees: fees || 'Pending'   
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
        const user = await User.findOne({ email });
        
        if (!user) return res.status(400).json({ success: false, message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });

        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};  