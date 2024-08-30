import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

const services = [
  { name: "Kundli (Birth Chart)", icon: "https://www.astrosage.com/images/icons/ic_kundli.png" },
  { name: "Horoscope Matching", icon: "https://www.astrosage.com/images/icons/ic_match.png" },
  { name: "AstroSage Matrimony", icon: "https://www.astrosage.com/images/icons/ic_marriage.png" },
  { name: "Ask a Question", icon: "https://www.astrosage.com/images/icons/ask_question.png" },
  { name: "Dhruv Astro Software", icon: "https://www.astrosage.com/images/icons/ic_dhruv.png" },
  { name: "Career Counselling", icon: "https://www.astrosage.com/images/icons/ic_cogniastro.png" },
  { name: "Brihat Horoscope", icon: "https://www.astrosage.com/images/icons/ic_brihat.png" },
  { name: "Exam Results", icon: "https://www.astrosage.com/images/result.png" },
  { name: "Talk to Astrologer", icon: "https://www.astrosage.com/images/icons/varta.png" },
  { name: "Paid Services", icon: "https://www.astrosage.com/images/icons/ic_dollar.png" },
  { name: "Horoscope 2024", icon: "https://www.astrosage.com/images/icons/ic_varshfal.png" },
  { name: "Lal Kitab Horoscope", icon: "https://www.astrosage.com/images/icons/ic_lalkitab.png" },
  { name: "Sade Sati Life Report", icon: "https://www.astrosage.com/images/icons/ic_saturn.png" },
  { name: "Year Analysis (Varshphal)", icon: "https://www.astrosage.com/images/icons/ic_varshfal.png" },
  { name: "Baby Name Suggestion", icon: "https://www.astrosage.com/images/icons/ic_baby.png" },
  { name: "Gochar Phal (Transit Report)", icon: "https://www.astrosage.com/images/icons/ic_gocharfal.png" },
  { name: "Life Report", icon: "https://www.astrosage.com/images/icons/ic_prediction.png" },
  { name: "Online Astrology Software", icon: "https://www.astrosage.com/images/icons/software.png" },
  { name: "Hindi Kundli", icon: "https://www.astrosage.com/images/icons/ic_hindi.png" },
  { name: "Numerology Calculator", icon: "https://www.astrosage.com/images/icons/ic_numerology.png" },
  { name: "Celebrity Horoscope", icon: "https://www.astrosage.com/images/icons/ic_celebrity.png" },
  { name: "Learn Astrology", icon: "https://www.astrosage.com/images/icons/ic_learn.png" },
  { name: "Love Horoscope", icon: "https://www.astrosage.com/images/icons/ic_heart.png" },
  { name: "Gemstones Report", icon: "https://www.astrosage.com/images/icons/ic_gemstones.png" },
  { name: "Mangal Dosha", icon: "https://www.astrosage.com/images/icons/ic_mangal.png" },
  { name: "Dasha Phal Analysis", icon: "https://www.astrosage.com/images/icons/ic_dasa.png"},
  { name: "Ascendant Calculator", icon: "https://www.astrosage.com/images/icons/ic_asc.png"},
  { name: "Today's Rahukaal", icon: "https://www.astrosage.com/images/icons/ic_clock.png"},
  { name: "AstroSage TV", icon: "https://www.astrosage.com/images/icons/ic_tv.png"},
  { name: "Occult Directory", icon: "https://www.astrosage.com/images/icons/ic_occult.png"},
  { name: "Chinese Astrology", icon: "https://www.astrosage.com/images/icons/ic_chinese.png"},
  { name: "Kaalsarp Dosha", icon: "https://www.astrosage.com/images/icons/ic_kalsarp.png"},
];

function HeroScope() {
  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom sx={{bgcolor:"orange",marginTop:'1rem'}}>
        Free Horoscope and Astrology Services
      </Typography>
      <Grid container spacing={0} padding={2} style={{ borderCollapse: 'collapse' }}>
        {services.map((service, index) => (
          <Grid
            item
            xs={12}
            sm={3}
            key={index}
            style={{
              border: '2px solid orange',
              boxSizing: 'border-box',
            }}
          >
            <Paper elevation={3} style={{ textAlign: 'center', padding: '10px', height: '100%' }}>
              <IconButton aria-label={service.name}>
                <img src={service.icon} alt={service.name} style={{ width: '40px', height: '40px' }} />
              </IconButton>
              <Typography variant="body1">
                {service.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default HeroScope;