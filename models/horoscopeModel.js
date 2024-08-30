// models/horoscopeModel.js
const axios = require('axios');
const cheerio = require('cheerio');

async function fetchMonthlyHoroscope(zodiacSign) {
  try {
    const url = `https://www.astrosage.com/horoscope/monthly-${zodiacSign}-horoscope.asp`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const contentHtml = $('.ui-sign-content-box').html();
    const content = cheerio.load(contentHtml);

    content('a').each((index, element) => {
      content(element).replaceWith(content(element).html());
    });

    let processedHtml = content.html();
    processedHtml = processedHtml.replace(/<\/?(head|body)[^>]*>/gi, '');
    const finalHtml = `<div id="monthly-horoscope">\n${processedHtml}\n</div>`;

    return finalHtml;
  } catch (error) {
    console.error('Error fetching monthly horoscope:', error);
    throw error;
  }
}

module.exports = { fetchMonthlyHoroscope };
