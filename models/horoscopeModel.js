const axios = require('axios');
const cheerio = require('cheerio');

// Function to fetch daily horoscope based on zodiac sign
async function fetchDailyHoroscope(zodiacSign) {
  try {
    const url = `https://www.astrosage.com/horoscope/daily-${zodiacSign}-horoscope.asp`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let content = '';
    $('.ui-large-content.text-justify').each((index, element) => {
      let text = $(element).clone().find('a').remove().end().text().trim();
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

// Function to fetch weekly horoscope based on zodiac sign
async function fetchWeeklyHoroscope(zodiacSign) {
  try {
    const url = `https://www.astrosage.com/horoscope/weekly-${zodiacSign}-horoscope.asp`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let content = '';
    $('.ui-sign-content-box .content').each((index, element) => {
      let text = $(element).clone().find('a').remove().end().text().trim();
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

// Function to fetch monthly horoscope based on zodiac sign
async function fetchMonthlyHoroscope(zodiacSign) {
  try {
    const url = `https://www.astrosage.com/horoscope/monthly-${zodiacSign}-horoscope.asp`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const contentHtml = $('.ui-sign-content-box').html();
    const content = cheerio.load(contentHtml);

    content('a').each((index, element) => {
      content(element).replaceWith(content(element).text());
    });

    content('p').last().remove();

    let processedHtml = content.html();
    processedHtml = processedHtml.replace(/<\/?(html|head|body)[^>]*>/gi, '');

    const finalHtml = `<div id="monthly-horoscope">\n${processedHtml}\n</div>`;

    return finalHtml;
  } catch (error) {
    console.error('Error fetching monthly horoscope:', error);
    throw error;
  }
}

// Function to fetch yearly horoscope based on year and zodiac sign
async function fetchYearlyHoroscope(year, zodiacSign) {
  try {
    const url = `https://www.astrosage.com/${year}/${zodiacSign}-horoscope-${year}.asp`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const divs = $('.ui-content.bg-light-gray');
    divs.find('div.card-view-content').last().remove();

    let processedHtml = '';
    divs.each((index, element) => {
      const divContent = $(element);
      divContent.find('p:has(a)').remove();
      divContent.find('a, img').remove();
      processedHtml += divContent.html();
    });

    const finalHtml = `<div id="horoscope-content">\n${processedHtml}\n</div>`;

    return finalHtml;
  } catch (error) {
    console.error('Error fetching yearly horoscope:', error);
    throw error;
  }
}

// Function to fetch and return the horoscope data
async function getHoroscope(type, zodiacSign, year = new Date().getFullYear()) {
  try {
    let content;
    switch (type) {
      case 'daily':
        content = await fetchDailyHoroscope(zodiacSign);
        break;
      case 'weekly':
        content = await fetchWeeklyHoroscope(zodiacSign);
        break;
      case 'monthly':
        content = await fetchMonthlyHoroscope(zodiacSign);
        break;
      case 'yearly':
        content = await fetchYearlyHoroscope(year, zodiacSign);
        break;
      default:
        throw new Error('Invalid horoscope type');
    }
    return content;
  } catch (error) {
    console.error('Failed to fetch horoscope:', error);
    return null;
  }
}

// Export functions
module.exports = {
  fetchDailyHoroscope,
  fetchWeeklyHoroscope,
  fetchMonthlyHoroscope,
  fetchYearlyHoroscope,
  getHoroscope,
};
