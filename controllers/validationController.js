const { matchedData, validationResult, body, param } = require('express-validator');

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

// Validation advice@start
exports.getAdvice = [param('adviceID').trim().escape().toInt().notEmpty().withMessage('Advice ID is not valid!')];

exports.createAdvice = [body('content').trim().escape().notEmpty().withMessage('Advice content is required!')];
// Validation advice@end
