const express = require('express');
const passwordController = require('../controllers/Password');

const router = express.Router();

router.use('/forgotpassword', passwordController.forgotPassword);
router.get('/resetpassword/:id', passwordController.resetpassword);




router.get('/updatepassword/:resetpasswordid', passwordController.updatepassword)


module.exports = router;