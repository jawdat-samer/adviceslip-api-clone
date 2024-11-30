const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const validationController = require('../controllers/validationController');

const router = express.Router();

router.post('/signup', validationController.signup, validationController.checkValidation, authController.signup);
router.post('/login', validationController.login, validationController.checkValidation, authController.login);

router.get('/', authController.protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

module.exports = router;
