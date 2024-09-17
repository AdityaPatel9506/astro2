const panchangModel = require('../models/panchangModel');

const fetchPanchang = async (req, res) => {
  const date = req.query.date || req.body.date;
  const time = req.query.time || req.body.time;
  const cityName = req.query.cityName || req.body.cityName;
  const language = req.query.language || req.body.language;

  console.log(`Date: ${date}, Time: ${time}, City: ${cityName}`);

  try {
    // Fetch Panchang data (either from DB or API)
    const panchangData = await panchangModel.getPanchangDetails(date, time, cityName, language);

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
