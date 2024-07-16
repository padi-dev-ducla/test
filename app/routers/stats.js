const express = require('express');
const statsController = require('../controllers/statsController');
const router = express.Router();

router.get('/counts', statsController.getCounts);

module.exports = router;
