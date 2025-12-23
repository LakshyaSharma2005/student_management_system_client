const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    unique: true, 
    required: true,
    trim: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['Admin', 'Teacher', 'Student'], 
    required: true 
  },
  // 🆕 NEW FIELDS ADDED HERE
  course: { 
    type: String, 
    default: '' 
  },
  subject: { 
    type: String, 
    default: '' // For Teachers
  },
  fees: { 
    type: String, 
    default: 'Pending' // For Students
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);