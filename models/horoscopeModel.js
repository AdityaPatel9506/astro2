const axios = require('axios');
const cheerio = require('cheerio');

// Function to fetch daily horoscope based on zodiac sign
async function fetchDailyHoroscope(zodiacSign) {
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
    console.error('Error fetching daily horoscope:', error);
    return null;
  }
}

// Function to fetch monthly horoscope based on zodiac sign
async function fetchMonthlyHoroscope(zodiacSign) {
  try {
    const url = `https://www.astrosage.com/horoscope/monthly-${zodiacSign}-horoscope.asp`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract HTML content
    const contentHtml = $('.ui-sign-content-box').html();
    const content = cheerio.load(contentHtml);

    // Remove <a> tags and keep their text
    content('a').each((index, element) => {
      content(element).replaceWith(content(element).text());
    });

    // Remove the last <p> tag
    content('p').last().remove();

    // Convert to string and clean up any unwanted tags
    let processedHtml = content.html();
    processedHtml = processedHtml.replace(/<\/?(html|head|body)[^>]*>/gi, '');
    
    // Wrap the content in a div with an ID for easier styling
    const finalHtml = `<div id="monthly-horoscope">\n${processedHtml}\n</div>`;

    return finalHtml;
  } catch (error) {
    console.error('Error fetching monthly horoscope:', error);
    throw error;
  }
}

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
    
    return content;
  } catch (error) {
    console.error('Error fetching weekly horoscope:', error);
    return null;
  }
}

// Export functions
module.exports = { fetchDailyHoroscope, fetchMonthlyHoroscope, fetchWeeklyHoroscope };

