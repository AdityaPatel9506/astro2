const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.astrosage.com/2024/aries-horoscope-2024.asp'; // URL for Aries

async function fetchAriesHoroscope() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        
        // Extracting data from multiple elements
        let content = '';
        $('.card-view-content').each((index, element) => {
            content += $(element).html() + '\n';
        });

        // Extract additional relevant content if needed
        const additionalData = [];
        $('.some-other-class').each((index, element) => {
            additionalData.push($(element).text().trim());
        });

        console.log('Aries Horoscope Content:', content || 'Content not found.');
        console.log('Additional Data:', additionalData.length > 0 ? additionalData : 'No additional data found.');
    } catch (error) {
        console.error('Error fetching the content:', error);
    }
}

fetchAriesHoroscope();
