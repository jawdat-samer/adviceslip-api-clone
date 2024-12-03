const { matchedData, validationResult, body, param, query } = require('express-validator');

const formatter = ({ msg }) => {
  return {
    error: 'Validation Error!',
    message: msg,
  };
};

exports.checkValidation = (req, res, next) => {
  const validation = validationResult(req).formatWith(formatter);
  if (!validation.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      errors: validation.mapped({ onlyFirstError: true }),
    });
  } else {
    req.validatedData = matchedData(req);

    next();
  }
};

// Validation auth@start
exports.signup = [
  body('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Name is required!')
    .isLength({ min: 1, max: 300 })
    .withMessage('Name is too long!'),
  body('email')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Email not valid!')
    .isLength({ min: 1, max: 300 })
    .withMessage('email is too long!'),
  body('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Password is required')
    .isStrongPassword({ minLength: 8, minLowercase: 0, minNumbers: 0, minSymbols: 0, minUppercase: 0 })
    .withMessage('Password must be at least 8 characters')
    .isLength({ min: 1, max: 300 })
    .withMessage('Password is too long!'),
  body('passwordConfirm')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Confirm your password!')
    .isLength({ min: 1, max: 300 })
    .withMessage('Password Confirm is too long!')
    .custom((value, { req }) => {
      if (value === req.body.password) {
        return true;
      } else {
        throw new Error('Passwords did not match!');
      }
    }),
];

exports.login = [
  body('email')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Email not valid!')
    .isLength({ min: 1, max: 300 })
    .withMessage('Email is too long!'),
  body('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1, max: 300 })
    .withMessage('Password is too long!'),
];

exports.forgotPassword = [
  body('email')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Email not valid!')
    .isLength({ min: 1, max: 300 })
    .withMessage('Email is too long!'),
];

exports.resetPassword = [
  param('resetToken').trim().escape().notEmpty().withMessage('Invalid reset token!'),
  body('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Password is required')
    .isStrongPassword({ minLength: 8, minLowercase: 0, minNumbers: 0, minSymbols: 0, minUppercase: 0 })
    .withMessage('Password must be at least 8 characters')
    .isLength({ min: 1, max: 300 })
    .withMessage('Password is too long!'),
  body('passwordConfirm')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Confirm your password!')
    .isLength({ min: 1, max: 300 })
    .withMessage('Password Confirm is too long!')
    .custom((value, { req }) => {
      if (value === req.body.password) {
        return true;
      } else {
        throw new Error('Passwords did not match!');
      }
    }),
];
// Validation auth@end

// Validation user@start
exports.getAllUsers = [
  query('active').optional().trim().escape().notEmpty().withMessage(`Can't be empty!`).toBoolean(),
  query('show').optional().trim().escape().notEmpty().toInt().withMessage(`Can't be empty!`),
  query('page').optional().trim().escape().notEmpty().toInt().withMessage(`Can't be empty!`),
];

exports.getUser = [param('userId').trim().escape().notEmpty().withMessage('User ID is required!').toInt()];

exports.createUser = [
  body('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Name is required!')
    .isLength({ min: 1, max: 300 })
    .withMessage('Name is too long!'),
  body('email')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Email not valid!')
    .isLength({ min: 1, max: 300 })
    .withMessage('email is too long!'),
  body('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Password is required')
    .isStrongPassword({ minLength: 8, minLowercase: 0, minNumbers: 0, minSymbols: 0, minUppercase: 0 })
    .withMessage('Password must be at least 8 characters')
    .isLength({ min: 1, max: 300 })
    .withMessage('Password is too long!'),
  body('role')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('role is required!')
    .isLength({ min: 1, max: 300 })
    .withMessage('role is too long!'),
];

exports.updateUser = [
  param('userId').trim().escape().toInt().notEmpty().withMessage('User ID is not valid!'),
  body('name')
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Name is required!')
    .isLength({ min: 1, max: 300 })
    .withMessage('Name is too long!'),
  body('email')
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Email not valid!')
    .isLength({ min: 1, max: 300 })
    .withMessage('email is too long!'),
  body('password')
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Password is required')
    .isStrongPassword({ minLength: 8, minLowercase: 0, minNumbers: 0, minSymbols: 0, minUppercase: 0 })
    .withMessage('Password must be at least 8 characters')
    .isLength({ min: 1, max: 300 })
    .withMessage('Password is too long!'),
  body('role')
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage('role is required!')
    .isLength({ min: 1, max: 300 })
    .withMessage('role is too long!'),
  body('active').trim().escape().notEmpty().toBoolean().withMessage('active status is required!'),
];

exports.deleteUser = [param('userId').trim().escape().toInt().notEmpty().withMessage('User ID is not valid!')];

exports.updateMe = [
  body('name')
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Name is required!')
    .isLength({ min: 1, max: 300 })
    .withMessage('Name is too long!'),
  body('email')
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Email not valid!')
    .isLength({ min: 1, max: 300 })
    .withMessage('email is too long!'),
];

exports.updatePassword = [
  body('oldPassword')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Old Password is required!')
    .isLength({ min: 1, max: 300 })
    .withMessage('Old password is too long!'),
  body('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Password is required')
    .isStrongPassword({ minLength: 8, minLowercase: 0, minNumbers: 0, minSymbols: 0, minUppercase: 0 })
    .withMessage('Password must be at least 8 characters')
    .isLength({ min: 1, max: 300 })
    .withMessage('Password is too long!'),
  body('passwordConfirm')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Confirm your password!')
    .isLength({ min: 1, max: 300 })
    .withMessage('Password Confirm is too long!')
    .custom((value, { req }) => {
      if (value === req.body.password) {
        return true;
      } else {
        throw new Error('Passwords did not match!');
      }
    }),
];

exports.deleteMe = [
  body('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1, max: 300 })
    .withMessage('Password is too long!'),
];
// Validation user@end

// Validation advice@start
exports.getAdvice = [param('adviceID').trim().escape().toInt().notEmpty().withMessage('Advice ID is not valid!')];

exports.createAdvice = [body('content').trim().escape().notEmpty().withMessage('Advice content is required!')];
// Validation advice@end
