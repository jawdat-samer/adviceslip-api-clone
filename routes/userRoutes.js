const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const validationController = require('../controllers/validationController');

const router = express.Router();

router.post('/signup', validationController.signup, validationController.checkValidation, authController.signup);
router.post('/login', validationController.login, validationController.checkValidation, authController.login);

router.post(
  '/forgotPassword',
  validationController.forgotPassword,
  validationController.checkValidation,
  authController.forgotPassword
);
router.patch(
  '/resetPassword/:resetToken',
  validationController.resetPassword,
  validationController.checkValidation,
  authController.resetPassword
);

module.exports = router;
