const express = require('express');
const router = express.Router();
const birthChartController = require('../controllers/birthChartController');

// Route to create and fetch birth chart
router.post('/birthchart', birthChartController.createBirthChart);

module.exports = router;
