const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs'); // Import File System module

// Function to fetch weekly horoscope based on zodiac sign
async function fetchWeeklyHoroscope(zodiacSign) {
  try {
    // Construct the URL based on zodiac sign
    const url = `https://www.astrosage.com/horoscope/weekly-${zodiacSign}-horoscope.asp`;
    
    // Fetch the HTML content
    const { data } = await axios.get(url);
    
    // Load the HTML into cheerio
    const $ = cheerio.load(data);
    
    // Extract content with the class 'content' inside '.ui-sign-content-box'
    let content = '';
    $('.ui-sign-content-box .content').each((index, element) => {
      // Get text content and remove <a> tags
      let text = $(element).clone().find('a').remove().end().text().trim();
      // Add to content with line break
      if (text) {
        content += `${text}\n\n`;
      }
    });
    
    // Save content to a text file
    const fileName = `${zodiacSign}-weekly-horoscope.txt`;
    fs.writeFileSync(fileName, content, 'utf8');
    console.log(`Weekly Horoscope for ${zodiacSign} saved to ${fileName}`);
  } catch (error) {
    console.error('Error fetching weekly horoscope:', error);
  }
}

// Example usage
const zodiacSign = 'aries'; // Change this as needed
fetchWeeklyHoroscope(zodiacSign);
