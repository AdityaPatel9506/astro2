const { getCoordinates, getTimezoneFromCoords } = require('../utils/locationUtils');
const axios = require('axios');
require('dotenv').config();

// Function to format the date as DD/MM/YYYY
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Utility function to generate the birth chart
const generateBirthChart = async (lat, lon, dob, tob, api_key) => {
  try {
    const timezone = await getTimezoneFromCoords(lat, lon);
    const formattedDob = formatDate(dob);

    const params = {
        dob: '11/03/1994', // Ensure correct date format
        tob: '11:40',
        lat: 22.71792, // Use precise latitude
        lon: 75.8333, // Use precise longitude
        tz: 5.5,
        div: 'D1',
        color: '%23ff3366',
        style: 'north',
        api_key: process.env.API_KEY, // Ensure to replace with actual API key
        lang: 'en',
        font_size: 12,
        font_style: 'roboto',
        colorful_planets: 0,
        size: 300,
        stroke: 2,
        format: 'base64'
      };
    // Construct the final URL
    const baseUrl = 'https://api.vedicastroapi.com/v3-json//horoscope/chart-image';
    const url = `${baseUrl}?${new URLSearchParams(params).toString()}`;

    // Log the final URL for debugging
    console.log('Final Request URL:', url);

    // Make the API request
    const response = await axios.get(url);

    // Return XML code
    return response.data;
  } catch (error) {
    console.error('Error generating birth chart:', error.message);
    throw new Error('Error generating birth chart.');
  }
};

// Create a new birth chart entry
const createBirthChart = async (req, res) => {
  try {
    const { dob, tob, placeOfBirth } = req.body;

    // Validate the input
    if (!dob || !tob || !placeOfBirth) {
      return res.status(400).json({ error: 'Missing required fields: dob, tob, or placeOfBirth.' });
    }

    // Get coordinates based on place of birth
    const { latitude, longitude } = await getCoordinates(placeOfBirth);

    // API key from environment variables
    const api_key = process.env.API_KEY;
    if (!api_key) {
      return res.status(500).json({ error: 'API key not found in environment variables.' });
    }

    // Generate the birth chart
    const xmlResponse = await generateBirthChart(latitude, longitude, dob, tob, api_key);

    // Send XML response
    res.set('Content-Type', 'application/xml');
    res.send(xmlResponse);
  } catch (error) {
    console.error('Error creating birth chart:', error.message);
    res.status(500).json({ error: 'Error generating birth chart.' });
  }
};

module.exports = {
  createBirthChart
};
