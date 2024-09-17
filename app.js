const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const blogRoutes = require('./routes/blogRoutes');
const panchangRoutes = require('./routes/panchangRoutes');
const matchingRoutes = require('./routes/kundaliRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const horoscopeRoutes = require('./routes/horoscopeRoutes');
const birthchartRoutes = require('./routes/birthChartRoutes');
const { sendEmail } = require('./controllers/emailController');

const app = express();

app.use(cookieParser());

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (including uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Use routes
app.use('/blogs', blogRoutes);
app.use('/panchang', panchangRoutes);
app.use('/kundali', matchingRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/horoscope', horoscopeRoutes);
app.use('/birthChart', birthchartRoutes);

app.post('/send-email', sendEmail);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
