const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env
const { formatDate } = require('../utils/dateUtils'); // Import the formatDate function
const { getTimezoneFromCoords } = require('../utils/locationUtils'); // Import location utilities

// Controller function to get Ashtakvarga details
const getashtakvarga = async (req, res) => {
  const { dob, tob, lat, lon, language } = req.query;

  // Log the parameters to the console
  console.log('Received parameters:', { dob, tob, lat, lon, language });

  // Get the API key from the environment variables
  const api_key = process.env.API_KEY;

  // Validate that all required parameters are present
  if (!dob || !tob || !lat || !lon || !language || !api_key) {
    console.error('Validation failed: Missing required query parameters');
    return res.status(400).json({ error: 'Missing required query parameters: dob, tob, lat, lon, language' });
  }

  // Format the date of birth
  const formattedDob = formatDate(dob);

  try {
    // Get timezone from coordinates
    const tz = await getTimezoneFromCoords(parseFloat(lat), parseFloat(lon));

    // Construct the API endpoint URL
    const apiUrl = 'https://api.vedicastroapi.com/v3-json/horoscope/ashtakvarga'; // Replace with the actual API endpoint

    // Make the API request with the provided parameters
    const response = await axios.get(apiUrl, {
      params: {
        dob: formattedDob,
        tob,
        lat,
        lon,
        tz,
        api_key,
        lang: language, // Use the selected language
      },
    });

    // Log the API response for debugging
    console.log('API response:', response.data);

    // Send the API response back to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Ashtakvarga details:', error.message);
    res.status(500).json({ error: 'Failed to fetch Ashtakvarga details' });
  }
};

module.exports = {
  getashtakvarga,
};
