// controllers/horoscopeController.js
const { fetchDailyHoroscope, fetchMonthlyHoroscope, fetchWeeklyHoroscope } = require('../models/horoscopeModel');

// Fetch daily horoscope
async function getDailyHoroscope(req, res) {
  const { zodiacSign } = req.params;
  
  try {
    const horoscopeHtml = await fetchDailyHoroscope(zodiacSign);
    res.send(horoscopeHtml);
  } catch (error) {
    res.status(500).send('Failed to fetch daily horoscope');
  }
}

// Fetch monthly horoscope
async function getMonthlyHoroscope(req, res) {
  const { zodiacSign } = req.params;

  try {
    const horoscopeHtml = await fetchMonthlyHoroscope(zodiacSign);
    res.send(horoscopeHtml);
  } catch (error) {
    res.status(500).send('Failed to fetch monthly horoscope');
  }
}

// Fetch weekly horoscope
async function getWeeklyHoroscope(req, res) {
  const { zodiacSign } = req.params;

  try {
    const horoscopeHtml = await fetchWeeklyHoroscope(zodiacSign);
    res.send(horoscopeHtml);
  } catch (error) {
    res.status(500).send('Failed to fetch weekly horoscope');
  }
}

module.exports = { getDailyHoroscope, getMonthlyHoroscope, getWeeklyHoroscope };
