const path = require('path');


const express = require('express');

const existingUserController = require('../controllers/existingUser');

const router = express.Router();
router.post('/login', existingUserController.login);

module.exports = router;