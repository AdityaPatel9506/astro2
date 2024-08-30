const axios = require('axios');
const cheerio = require('cheerio');

// Function to fetch horoscope based on zodiac sign
async function fetchHoroscope(zodiacSign) {
  try {
    // Construct the URL based on zodiac sign
    const url = `https://www.astrosage.com/horoscope/daily-${zodiacSign}-horoscope.asp`;
    
    // Fetch the HTML content
    const { data } = await axios.get(url);
    
    // Load the HTML into cheerio
    const $ = cheerio.load(data);
    
    // Extract content with the specified class
    let content = '';
    $('.ui-large-content.text-justify').each((index, element) => {
      // Get text content and remove <a> tags
      let text = $(element).clone().find('a').remove().end().text().trim();
      // Add to content with line break
      if (text) {
        content += `${text}\n\n`;
      }
    });
    
    return content;
  } catch (error) {
    console.error('Error fetching horoscope:', error);
    return null;
  }
}

// Define an async function to use fetchHoroscope and accept a zodiacSign parameter
const displayHoroscope = async (zodiacSign) => {
  try {
    const content = await fetchHoroscope(zodiacSign);
    if (content) {
      console.log(`Horoscope for ${zodiacSign}:`);
      console.log(content);
    } else {
      console.log('No content found.');
    }
  } catch (error) {
    console.error('Error displaying horoscope:', error);
  }
};

// Call the async function with a specific zodiac sign
const zodiacSign = 'aries'; // Change this to the desired zodiac sign
displayHoroscope(zodiacSign);
