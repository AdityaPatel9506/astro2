// controllers/horoscopeController.js
const { fetchMonthlyHoroscope } = require('../models/horoscopeModel');

async function getHoroscope(req, res) {
  const { zodiacSign } = req.params;

  try {
    const horoscopeHtml = await fetchMonthlyHoroscope(zodiacSign);
    res.send(horoscopeHtml);
  } catch (error) {
    res.status(500).send('Failed to fetch horoscope');
  }
}

module.exports = { getHoroscope };
