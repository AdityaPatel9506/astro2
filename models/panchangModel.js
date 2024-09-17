const axios = require('axios');
const cities = require('all-the-cities');
const geoTz = require('geo-tz');
const moment = require('moment-timezone');
const db = require('../config/db'); // Assuming this is your database connection

// Function to get the latitude and longitude of a city using `all-the-cities`
const getCoordinates = async (cityName) => {
  console.log("Location data called");

  try {
    const city = cities.find(city => city.name.toLowerCase() === cityName.toLowerCase());
    if (city) {
      console.log("Location data fetched");
      const { coordinates } = city.loc;
      const [longitude, latitude] = coordinates;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      return { latitude, longitude };
    } else {
      console.log("City not found");
      throw new Error('City not found. Please verify the city name.');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error.message);
    throw new Error('Please enter the official name of your city.');
  }
};

const convertToDecimal = (offset) => {
  // offset is in the format of `+HH:MM`
  const [sign, time] = offset.split(/([+-])/).filter(Boolean);
  const [hours, minutes] = time.split(':').map(Number);
  const decimalOffset = hours + minutes / 60;
  return sign === '-' ? -decimalOffset : decimalOffset;
};

// Function to get the timezone based on latitude and longitude using `geo-tz`
const getTimezoneFromCoords = (latitude, longitude) => {
  try {
    const timezones = geoTz.find(latitude, longitude);
    if (timezones && timezones.length > 0) {
      const timezone = timezones[0];
      console.log(`Timezone: ${timezone}`);
      const offset = moment.tz(timezone).format('Z');
      console.log(`Offset: ${offset}`);
      const decimalOffset = convertToDecimal(offset);
      console.log(`Decimal Offset: ${decimalOffset}`);
      return decimalOffset;
    } else {
      throw new Error('Timezone data not found.');
    }
  } catch (error) {
    console.error('Error fetching timezone:', error.message);
    throw new Error('Error fetching timezone data.');
  }
};

// Function to check if a Panchang record exists in the database
const checkPanchangExists = async (date, cityName, language) => {
  const query = 'SELECT * FROM panchang_data WHERE date = ? AND city_name = ? AND language = ?';
  const [rows] = await db.execute(query, [date, cityName, language]);
  return rows.length > 0 ? rows[0] : null; // Return the existing record if found
};

// Function to insert Panchang data into the database
const insertPanchangRecord = async (date, cityName, panchangData, language) => {
  const query = 'INSERT INTO panchang_data (date, city_name, json_data, language) VALUES (?, ?, ?, ?)';
  await db.execute(query, [date, cityName, JSON.stringify(panchangData), language]);
  console.log('Panchang data saved to the database');
};

// Function to get Panchang details using the provided parameters
const getPanchangDetails = async (date, time, cityName, language) => {
  console.log("Panchang data called");

  try {
    const coordinates = await getCoordinates(cityName);
    const { latitude, longitude } = coordinates;
    const timezoneOffset = getTimezoneFromCoords(latitude, longitude);

    console.log(`Date: ${date}`);
    console.log(`Time: ${time}`);
    console.log(`Timezone Offset: ${timezoneOffset}`);

    // Check if Panchang record already exists in the database
    const existingRecord = await checkPanchangExists(date, cityName, language);
    if (existingRecord) {
      console.log(`Panchang record for ${cityName} on ${date} in language ${language} already exists in the database.`);
      return { 
        success: true, 
        data: JSON.parse(existingRecord.json_data) // Convert JSON text to JavaScript object
      };
    }

    // Fetch Panchang data from the API if not found in the database
    const response = await axios.get('https://api.vedicastroapi.com/v3-json/panchang/panchang', {
      params: {
        api_key: process.env.API_KEY,
        date: date,  // No formatting needed
        lat: latitude,
        lon: longitude,
        tz: timezoneOffset,
        lang: language,
      },
    });

    console.log("Response data:", response.data);

    // Check if the API response status is 200
    if (response.data.status === 200) {
      const panchangData = response.data;
      console.log(panchangData);

      // Save Panchang data to the database
      await insertPanchangRecord(date, cityName, panchangData, language);

      return {
        success: true,
        data: panchangData,
      };
    } else {
      throw new Error(`API responded with status code ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching Panchang data:', error.message);
    let errorMessage = 'Error fetching Panchang data.';

    if (error.message.includes('City not found')) {
      errorMessage = 'City not found. Please verify the city name.';
    } else if (error.message.includes('timezone')) {
      errorMessage = 'Error determining the timezone. Please check the coordinates.';
    } else if (error.message.includes('API responded with status code')) {
      errorMessage = 'Error fetching data from the API. Please try again later.';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

module.exports = {
  getCoordinates,
  getPanchangDetails,
};
