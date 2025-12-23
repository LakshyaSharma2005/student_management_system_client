const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // 1. Connection
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from your .env file");
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📡 Connected to MongoDB Atlas...");

    // 2. Clear existing users to prevent duplicates or validation conflicts
    console.log("🧹 Clearing old user data...");
    await User.deleteMany();

    // 3. Hash the shared password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password@123", salt);

    // 4. Prepare the data
    const users = [
      { 
        name: "Super Admin", 
        email: "admin@gmail.com", 
        password: hashedPassword, 
        role: "Admin" 
      },
      { 
        name: "Prof. Sharma", 
        email: "teacher@gmail.com", 
        password: hashedPassword, 
        role: "Teacher" 
      },
      { 
        name: "Lakshya Student", 
        email: "student@gmail.com", 
        password: hashedPassword, 
        role: "Student", 
        course: "Computer Science" // This will now work because your Model is a String!
      }
    ];

    // 5. Insert into Database
    await User.insertMany(users);
    
    console.log("-----------------------------------------------");
    console.log("✅ SUCCESS: Database has been seeded!");
    console.log("📧 Admin: admin@gmail.com | pass: password@123");
    console.log("📧 Teacher: teacher@gmail.com | pass: password@123");
    console.log("📧 Student: student@gmail.com | pass: password@123");
    console.log("-----------------------------------------------");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Error:", err.message);
    process.exit(1);
  }
};

seedData();