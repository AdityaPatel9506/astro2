// routes/horoscopeRoutes.js
const express = require('express');
const { getHoroscope } = require('../controllers/horoscopeController');

const router = express.Router();

// Define route to fetch horoscope
router.get('/monthly/:zodiacSign', getHoroscope);

module.exports = router;
