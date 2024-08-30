const { getCoordinates, getTimezoneFromCoords } = require('../utils');
const axios = require('axios');

// Utility function to generate the birth chart
const generateBirthChart = async (lat, lon, dob, tob, api_key) => {
  const response = await axios.get('YOUR_API_URL', {
    params: {
      dob,
      tob,
      lat,
      lon,
      tz: await getTimezoneFromCoords(lat, lon),
      div: 'D1', // Default value; update based on user input
      color: '%23ff3366', // Default color; update based on user input
      style: 'north', // Default style; update based on user input
      api_key,
      lang: 'en', // Default language; update based on user input
      font_size: 12, // Default font size; update based on user input
      font_style: 'roboto', // Default font style; update based on user input
      colorful_planets: 0, // Default; update based on user input
      size: 300, // Default size; update based on user input
      stroke: 2, // Default stroke; update based on user input
      format: 'base64' // Default format; update based on user input
    }
  });

  return response.data; // Returns the XML code
};

// Create a new birth chart entry
const createBirthChart = async (req, res) => {
  try {
    const { dob, tob, lat, lon, api_key } = req.body;

    // Validate the input
    if (!dob || !tob || !lat || !lon || !api_key) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const xmlResponse = await generateBirthChart(lat, lon, dob, tob, api_key);
    res.set('Content-Type', 'application/xml');
    res.send(xmlResponse);
  } catch (error) {
    console.error('Error fetching birth chart:', error.message);
    res.status(500).json({ error: 'Error generating birth chart.' });
  }
};

module.exports = {
  createBirthChart
};
