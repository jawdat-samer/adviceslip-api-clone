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

router.use(authController.protect);

router.get('/me', userController.getMe);
router.patch('/updateMe', validationController.updateMe, validationController.checkValidation, userController.updateMe);
router.patch(
  '/updatePassword',
  validationController.updatePassword,
  validationController.checkValidation,
  authController.updatePassword
);
router.delete(
  '/deleteMe',
  validationController.deleteMe,
  validationController.checkValidation,
  userController.deleteMe
);

router.use(authController.restrictTo('admin'));

router.get('/', validationController.getAllUsers, validationController.checkValidation, userController.getAllUser);
router.get('/:userId', validationController.getUser, validationController.checkValidation, userController.getUser);
router.post('/', validationController.createUser, validationController.checkValidation, userController.createUser);
router.patch(
  '/:userId',
  validationController.updateUser,
  validationController.checkValidation,
  userController.updateUser
);
router.delete(
  '/:userId',
  validationController.deleteUser,
  validationController.checkValidation,
  userController.deleteUser
);

module.exports = router;
