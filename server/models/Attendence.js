const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  records: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Present', 'Absent'], default: 'Present' }
  }]
});

module.exports = mongoose.model('Attendance', AttendanceSchema);