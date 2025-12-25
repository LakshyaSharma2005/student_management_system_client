const Attendance = require("../models/Attendance");

// 1. Teacher marks attendance
exports.markAttendance = async (req, res) => {
  try {
    const { subjectId, records } = req.body; // records = [{ student: id, status: 'Present' }]
    const attendance = await Attendance.create({
      subject: subjectId,
      records: records,
      date: new Date(),
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Error marking attendance" });
  }
};

// 2. Student views their own attendance
exports.getStudentAttendance = async (req, res) => {
  try {
    // req.user.id comes from the JWT middleware
    const reports = await Attendance.find({
      "records.student": req.user.id,
    }).populate("subject", "name");

    // Filter records to only show the status for THIS specific student
    const studentReport = reports.map((report) => ({
      date: report.date,
      subject: report.subject.name,
      status: report.records.find((r) => r.student.toString() === req.user.id)
        .status,
    }));

    res.json(studentReport);
  } catch (error) {
    res.status(500).json({ message: "Error fetching report" });
  }
};
