const path = require('path');

const express = require('express');

const newUserController = require('../controllers/newUser');

const router = express.Router();
router.post('/add', newUserController.postAddUser);

module.exports = router;