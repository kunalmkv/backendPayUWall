const express = require('express');
const premiumController = require('../controllers/premiumFeature');
const authenticateMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/showLeaderBoard', authenticateMiddleware.authenticate, premiumController.getLeaderBoard);
module.exports = router;