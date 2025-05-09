const { body, param, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Task creation validation
exports.validateCreateTask = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('priority')
    .optional()
    .isIn(['High', 'Medium', 'Low'])
    .withMessage('Priority must be High, Medium, or Low'),
  
  body('status')
    .optional()
    .isIn(['Pending', 'Completed'])
    .withMessage('Status must be Pending or Completed'),
  
  validate
];

// Task update validation
exports.validateUpdateTask = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('priority')
    .optional()
    .isIn(['High', 'Medium', 'Low'])
    .withMessage('Priority must be High, Medium, or Low'),
  
  body('status')
    .optional()
    .isIn(['Pending', 'Completed'])
    .withMessage('Status must be Pending or Completed'),
  
  validate
];

// Task ID validation
exports.validateTaskId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID'),
  validate
]; 