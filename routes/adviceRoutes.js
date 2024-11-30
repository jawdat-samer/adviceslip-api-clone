const express = require('express');
const adviceController = require('../controllers/adviceController');
const validationController = require('../controllers/validationController');

const router = express.Router();

router.get('/', adviceController.getRandomAdvice);
router.get(
  '/:adviceID',
  validationController.getAdvice,
  validationController.checkValidation,
  adviceController.getAdvice
);
router.post(
  '/',
  validationController.createAdvice,
  validationController.checkValidation,
  adviceController.createAdvice
);

module.exports = router;
