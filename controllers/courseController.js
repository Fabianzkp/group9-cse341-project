const Course = require("../models/course");
const Instructor = require("../models/instructor");
const Student = require("../models/student");

exports.createCourse = async (req, res) => {
  try {
    const courses = Array.isArray(req.body) ? req.body : [req.body];
    const createdCourses = await Course.insertMany(courses);

    for (const course of createdCourses) {
      // Assign instructors
      const matchingInstructors = await Instructor.find({ course: course.department });
      if (matchingInstructors.length > 0) {
        course.instructors = matchingInstructors.map(inst => inst._id);
        await course.save();
        await Instructor.updateMany(
          { course: course.department },
          { $addToSet: { courses: course._id } }
        );
      }
      // Assign students
      const matchingStudents = await Student.find({ favoriteSubject: course.department });
      if (matchingStudents.length > 0) {
        course.students = matchingStudents.map(stu => stu._id);
        await course.save();
        await Student.updateMany(
          { favoriteSubject: course.department },
          { $addToSet: { courses: course._id } }
        );
      }
    }

    // Populate for response
    const populatedCourses = await Course.find({ _id: { $in: createdCourses.map(c => c._id) } }).populate({
      path: "instructors students",
      select: "firstName lastName email -_id",
    });

    res.status(201).json(populatedCourses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate({
      path: "instructors students",
      select: "firstName lastName email -_id",
    });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: "instructors students",
      select: "firstName lastName email -_id",
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    Object.assign(course, req.body);
    await course.save();

    // Clear existing relationships
    await Instructor.updateMany(
      { courses: course._id },
      { $pull: { courses: course._id } }
    );
    await Student.updateMany(
      { courses: course._id },
      { $pull: { courses: course._id } }
    );

    // Reassign instructors
    const matchingInstructors = await Instructor.find({ course: course.department });
    if (matchingInstructors.length > 0) {
      course.instructors = matchingInstructors.map(inst => inst._id);
      await course.save();
      await Instructor.updateMany(
        { course: course.department },
        { $addToSet: { courses: course._id } }
      );
    } else {
      course.instructors = [];
      await course.save();
    }

    // Reassign students
    const matchingStudents = await Student.find({ favoriteSubject: course.department });
    if (matchingStudents.length > 0) {
      course.students = matchingStudents.map(stu => stu._id);
      await course.save();
      await Student.updateMany(
        { favoriteSubject: course.department },
        { $addToSet: { courses: course._id } }
      );
    } else {
      course.students = [];
      await course.save();
    }

    // Populate for response
    const populatedCourse = await Course.findById(course._id).populate({
      path: "instructors students",
      select: "firstName lastName email -_id",
    });

    res.status(200).json(populatedCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    await Instructor.updateMany(
      { courses: course._id },
      { $pull: { courses: course._id } }
    );
    await Student.updateMany(
      { courses: course._id },
      { $pull: { courses: course._id } }
    );
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;