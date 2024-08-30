// routes/horoscopeRoutes.js
const express = require('express');
const { getDailyHoroscope, getMonthlyHoroscope, getWeeklyHoroscope } = require('../controllers/horoscopeController');

const router = express.Router();

// Route to fetch daily horoscope
// Example URL: /horoscope/daily/aries
router.get('/daily/:zodiacSign', getDailyHoroscope);

// Route to fetch monthly horoscope
// Example URL: /horoscope/monthly/aries
router.get('/monthly/:zodiacSign', getMonthlyHoroscope);

// Route to fetch weekly horoscope
// Example URL: /horoscope/weekly/aries
router.get('/weekly/:zodiacSign', getWeeklyHoroscope);

module.exports = router;
