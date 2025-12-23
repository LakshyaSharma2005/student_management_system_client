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
  course: { 
    type: String, 
    default: '' // Important for Students
  },
  subject: { 
    type: String, 
    default: '' // Important for Teachers
  },
  fees: { 
    type: String, 
    default: 'Pending' // Important for Finance
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);