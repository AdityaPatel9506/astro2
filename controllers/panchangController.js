const panchangModel = require('../models/panchangModel');

// Utility function to format date from yyyy-mm-dd to dd/mm/yyyy
const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const fetchPanchang = async (req, res) => {
  const date = req.query.date || req.body.date;
  const time = req.query.time || req.body.time;
  const cityName = req.query.cityName || req.body.cityName;
  const language = req.query.language || req.body.language;

  console.log(`Date: ${date}, Time: ${time}, City: ${cityName}`);

  try {
    // Format the date to dd/mm/yyyy before sending to the model
    const formattedDate = formatDate(date);

    // Fetch Panchang data (either from DB or API)
    const panchangData = await panchangModel.getPanchangDetails(formattedDate, time, cityName, language);

    if (panchangData.success) {
      res.json(panchangData);
    } else {
      res.status(500).json({ error: panchangData.error });
    }
  } catch (error) {
    console.error('Error in fetchPanchang controller:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  fetchPanchang,
};
