const { body, param, validationResult } = require("express-validator");

// Student Validator
const studentValidationRules = () => {
  return [
    body("firstName")
      .optional()
      .notEmpty()
      .withMessage("First name is required"),
    body("lastName").optional().notEmpty().withMessage("Last name is required"),
    body("gender").optional().notEmpty().withMessage("Gender is required"),
    body("age")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Age must be a positive integer"),
    body("favoriteSubject")
      .optional()
      .notEmpty()
      .withMessage("Favorite subject is required"),
    body("grade").optional().notEmpty().withMessage("Grade is required"),
    body("email").optional().isEmail().withMessage("Email is invalid"),
    param("id").optional().isMongoId().withMessage("Invalid student ID"),
  ];
};

// Instructor Validator
const instructorValidationRules = () => {
  return [
    body("firstName")
      .optional()
      .notEmpty()
      .withMessage("First name is required"),
    body("lastName").optional().notEmpty().withMessage("Last name is required"),
    body("course").optional().notEmpty().withMessage("Course is required"),
    body("gender").optional().notEmpty().withMessage("Gender is required"),
    body("age")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Age must be a positive integer"),
    body("email").optional().isEmail().withMessage("Email is invalid"),
    body("qualification")
      .optional()
      .notEmpty()
      .withMessage("Qualification is required"),
    param("id").optional().isMongoId().withMessage("Invalid instructor ID"),
    body("studentId")
      .optional()
      .isMongoId()
      .withMessage("Invalid student ID"),
  ];
};

// Library Validator
const bookValidationRules = () => {
  return [
    body("bookTitle")
      .optional()
      .notEmpty()
      .withMessage("Book title is required"),
    body("author").optional().notEmpty().withMessage("Author is required"),
    body("publisher")
      .optional()
      .notEmpty()
      .withMessage("Publisher is required"),
    body("publicationYear")
      .optional()
      .isInt({ min: 1000, max: new Date().getFullYear() })
      .withMessage("Publication year must be a valid year"),
    body("shelveLocation")
      .optional()
      .notEmpty()
      .withMessage("Shelve location is required"),
    body("genre").optional().notEmpty().withMessage("Genre is required"),
    body("copiesAvailable")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Copies available must be a positive integer"),
    param("id").optional().isMongoId().withMessage("Invalid book ID"),
    
    body("borrowerId")
      .optional()
      .isMongoId()
      .withMessage("Invalid borrower ID"),
    body("borrowerType")
      .optional()
      .isIn(["Student", "Instructor"])
      .withMessage("Borrower type must be Student or Instructor"),
  ];
};

// Player Validator
const playerValidationRules = () => {
  return [
    body("firstName")
      .optional()
      .notEmpty()
      .withMessage("First name is required"),
    body("lastName").optional().notEmpty().withMessage("Last name is required"),
    body("countryName")
      .optional()
      .notEmpty()
      .withMessage("Country is required"),
    body("gender").optional().notEmpty().withMessage("Gender is required"),
    body("age")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Age must be a positive integer"),
    body("position").optional().notEmpty().withMessage("Position is required"),
    body("goals")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Goals must not be a negative integer"),
    param("id").optional().isMongoId().withMessage("Invalid player ID"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const firstError = errors.array()[0].msg; // Extract the first error message
  return res.status(400).json({ errors: firstError });
};

module.exports = {
  studentValidationRules,
  instructorValidationRules,
  bookValidationRules,
  playerValidationRules,
  validate,
};
