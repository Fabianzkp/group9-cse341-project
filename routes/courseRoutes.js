const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const {
  courseValidationRules,
  validate,
} = require("../controllers/validator");

/**
 * @swagger
 *
 * # COURSE MANAGEMENT ROUTES
 *
 * /course:
 *   get:
 *     summary: Retrieve a list of courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: A list of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get("/", courseController.getCourses);

/**
 * @swagger
 * /course/{id}:
 *   get:
 *     summary: Retrieve a single course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: A single course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
router.get(
  "/:id",
  courseValidationRules(),
  validate,
  courseController.getCourseById
);

/**
 * @swagger
 * /course:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseCode
 *               - title
 *               - department
 *               - schedule
 *               - room
 *               - credits
 *             properties:
 *               courseCode: { type: string }
 *               title: { type: string }
 *               department: { type: string }
 *               schedule: { type: string }
 *               room: { type: string }
 *               credits: { type: number }
 *     responses:
 *       201:
 *         description: The created course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  courseValidationRules(),
  validate,
  courseController.createCourse
);

/**
 * @swagger
 * /course/{id}:
 *   put:
 *     summary: Update a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: The updated course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Course not found
 */
router.put(
  "/:id",
  courseValidationRules(),
  validate,
  courseController.updateCourse
);

/**
 * @swagger
 * /course/{id}:
 *   delete:
 *     summary: Delete a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
router.delete(
  "/:id",
  courseValidationRules(),
  validate,
  courseController.deleteCourse
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         courseCode:
 *           type: string
 *         title:
 *           type: string
 *         department:
 *           type: string
 *         schedule:
 *           type: string
 *         room:
 *           type: string
 *         credits:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 */

module.exports = router;