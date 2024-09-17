require('dotenv').config(); // Load environment variables from .env file

const mysql = require('mysql2/promise');
const cron = require('node-cron');

// Create a connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 13188, // Specify the port number here
    waitForConnections: true, // Ensure connections are available
    connectionLimit: 10, // Adjust based on your needs
    queueLimit: 0 // No limit on the number of queued connections
});

// Function to delete all Panchang data from the database
const deleteAllPanchangData = async () => {
    const query = 'DELETE FROM panchang_data WHERE date IS NOT NULL';
    try {
        await db.execute(query);
        console.log('All Panchang data deleted from the database');
    } catch (error) {
        console.error('Error deleting Panchang data:', error.message);
        throw new Error('Error deleting Panchang data.');
    }
};

// Check if today is the 1st day of the month
const checkAndDeleteData = async () => {
    const today = new Date();
    if (today.getDate() === 1) {
        console.log('It is the 1st of the month. Running scheduled task to delete all Panchang data...');
        try {
            await deleteAllPanchangData();
        } catch (error) {
            console.error('Error running scheduled task:', error.message);
        }
    } else {
        console.log('Today is not the 1st of the month. No deletion required.');
    }
};

// Test the connection
db.getConnection()
    .then(async connection => {
        console.log('Connected to the MySQL database.');
        connection.release(); // Release the connection back to the pool

        // Run the checkAndDeleteData function when the application starts
        await checkAndDeleteData();

        // Schedule the check to run daily at midnight
        cron.schedule('0 0 * * *', async () => {
            await checkAndDeleteData();
        });
    })
    .catch(err => {
        console.error('Error connecting to the MySQL database:', err.message);
        process.exit(1); // Exit the process with an error code
    });

module.exports = db;
