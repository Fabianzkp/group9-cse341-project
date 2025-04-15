const Attendance = require('../models/attendance');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Record new attendance
exports.recordAttendance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { studentId, courseId, date, status, notes } = req.body;

  try {
    const newAttendance = new Attendance({
      studentId,
      courseId,
      date: date || Date.now(),
      status,
      notes
    });

    const savedAttendance = await newAttendance.save();
    // Populate for response
    const populatedAttendance = await Attendance.findById(savedAttendance._id)
      .populate('studentId', 'firstName lastName -_id')
      .populate('courseId', 'title -_id');
    res.status(201).json(populatedAttendance);
  } catch (error) {
    console.error("Error recording attendance:", error);
    res.status(500).json({ message: 'Error recording attendance', error: error.message });
  }
};

// Get all attendance records (with potential filtering)
exports.getAllAttendance = async (req, res) => {
  try {
    const filter = {};
    if (req.query.studentId) {
      filter.studentId = req.query.studentId;
    }
    if (req.query.courseId) {
      filter.courseId = req.query.courseId;
    }

    const attendanceRecords = await Attendance.find(filter)
      .populate('studentId', 'firstName lastName -_id')
      .populate('courseId', 'title -_id');
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: 'Error fetching attendance records', error: error.message });
  }
};

// Get a single attendance record by ID
exports.getAttendanceById = async (req, res) => {
  try {
    const attendanceId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(attendanceId)) {
      return res.status(400).json({ message: 'Invalid Attendance ID format' });
    }

    const attendanceRecord = await Attendance.findById(attendanceId)
      .populate('studentId', 'firstName lastName -_id')
      .populate('courseId', 'title -_id');

    if (!attendanceRecord) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json(attendanceRecord);
  } catch (error) {
    console.error("Error fetching attendance by ID:", error);
    res.status(500).json({ message: 'Error fetching attendance record', error: error.message });
  }
};

// Update an attendance record
exports.updateAttendance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const attendanceId = req.params.id;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(attendanceId)) {
      return res.status(400).json({ message: 'Invalid Attendance ID format' });
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      attendanceId,
      updates,
      { new: true, runValidators: true }
    ).populate('studentId', 'firstName lastName -_id').populate('courseId', 'title -_id');

    if (!updatedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json(updatedAttendance);
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: 'Error updating attendance record', error: error.message });
  }
};

// Delete an attendance record
exports.deleteAttendance = async (req, res) => {
  try {
    const attendanceId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(attendanceId)) {
      return res.status(400).json({ message: 'Invalid Attendance ID format' });
    }

    const deletedAttendance = await Attendance.findByIdAndDelete(attendanceId);

    if (!deletedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting attendance:", error);
    res.status(500).json({ message: 'Error deleting attendance record', error: error.message });
  }
};