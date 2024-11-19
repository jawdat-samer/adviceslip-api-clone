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
    console.log('test');
    return res.status(400).json({
      status: 'fail',
      errors: validation.mapped({ onlyFirstError: true }),
    });
  } else {
    req.validatedData = matchedData(req);

    next();
  }
};

exports.createAdvice = [body('content').trim().escape().notEmpty().withMessage('Advice content is required!')];
