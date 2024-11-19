const express = require('express');
const adviceController = require('../controllers/adviceController');
const validationController = require('../controllers/validationController');

const router = express.Router();

router.get('/', adviceController.getRandomAdvice);

router.post(
  '/',
  validationController.createAdvice,
  validationController.checkValidation,
  adviceController.createAdvice
);

module.exports = router;
