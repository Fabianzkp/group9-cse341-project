const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { attendanceValidationRules, validate } = require('../controllers/validator');

/**
 * @swagger
 * components:
 *   schemas:
 *     Attendance:
 *       type: object
 *       required:
 *         - studentId
 *         - courseId
 *         - date
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the attendance record
 *         studentId:
 *           type: string
 *           description: ID of the student
 *         courseId:
 *           type: string
 *           description: ID of the course
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date and time of the attendance record
 *         status:
 *           type: string
 *           enum: [Present, Absent, Late]
 *           description: The attendance status
 *         notes:
 *           type: string
 *           description: Optional notes regarding the attendance
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of creation
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last update
 *       example:
 *         _id: 60d0fe4f5311236168a109ca
 *         studentId: 60d0fe4f5311236168a109c1
 *         courseId: 60d0fe4f5311236168a109c5
 *         date: "2023-10-27T10:00:00.000Z"
 *         status: "Present"
 *         notes: "Participated actively."
 *         createdAt: "2023-10-27T10:00:00.000Z"
 *         updatedAt: "2023-10-27T10:05:00.000Z"
 *   parameters:
 *      attendanceIdParam:
 *          name: id
 *          in: path
 *          required: true
 *          schema:
 *              type: string
 *          description: The ID of the attendance record
 */

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: API for managing student attendance records
 */

/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Record a new attendance entry
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - courseId
 *               - status
 *             properties:
 *               studentId:
 *                 type: string
 *                 description: ID of the student
 *               courseId:
 *                 type: string
 *                 description: ID of the course
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date of attendance (defaults to now if omitted)
 *               status:
 *                 type: string
 *                 enum: [Present, Absent, Late]
 *                 description: Attendance status
 *               notes:
 *                 type: string
 *                 description: Optional notes
 *             example:
 *               studentId: "60d0fe4f5311236168a109c1"
 *               courseId: "60d0fe4f5311236168a109c5"
 *               date: "2023-10-27T09:00:00Z"
 *               status: "Present"
 *               notes: "On time"
 *     responses:
 *       201:
 *         description: Attendance recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post('/', attendanceValidationRules(), validate, attendanceController.recordAttendance);

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Retrieve a list of attendance records
 *     tags: [Attendance]
 *     parameters:
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *         description: Filter by student ID
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *         description: Filter by course ID
 *     responses:
 *       200:
 *         description: A list of attendance records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 *       500:
 *         description: Server error
 */
router.get('/', attendanceController.getAllAttendance);

/**
 * @swagger
 * /attendance/{id}:
 *   get:
 *     summary: Get a single attendance record by ID
 *     tags: [Attendance]
 *     parameters:
 *       - $ref: '#/components/parameters/attendanceIdParam'
 *     responses:
 *       200:
 *         description: Attendance record details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Attendance record not found
 *       500:
 *         description: Server error
 */
router.get('/:id', attendanceValidationRules(), validate, attendanceController.getAttendanceById);

/**
 * @swagger
 * /attendance/{id}:
 *   put:
 *     summary: Update an attendance record
 *     tags: [Attendance]
 *     parameters:
 *       - $ref: '#/components/parameters/attendanceIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Updated date of attendance
 *               status:
 *                 type: string
 *                 enum: [Present, Absent, Late]
 *                 description: Updated attendance status
 *               notes:
 *                 type: string
 *                 description: Updated notes
 *             example:
 *               status: "Late"
 *               notes: "Arrived 10 minutes late"
 *     responses:
 *       200:
 *         description: Attendance record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       400:
 *         description: Invalid input data or ID format
 *       404:
 *         description: Attendance record not found
 *       500:
 *         description: Server error
 */
router.put('/:id', attendanceValidationRules(), validate, attendanceController.updateAttendance);

/**
 * @swagger
 * /attendance/{id}:
 *   delete:
 *     summary: Delete an attendance record
 *     tags: [Attendance]
 *     parameters:
 *       - $ref: '#/components/parameters/attendanceIdParam'
 *     responses:
 *       204:
 *         description: Attendance record deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Attendance record not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', attendanceValidationRules(), validate, attendanceController.deleteAttendance);

module.exports = router;