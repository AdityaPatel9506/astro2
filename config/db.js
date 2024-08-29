require('dotenv').config(); // Load environment variables from .env file

const mysql = require('mysql2/promise');

// Create a connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
<<<<<<< HEAD
    port: 3306, // Specify the port number here
=======
    port: 13188, // Specify the port number here
>>>>>>> a7e278bff9d85b8b148a101f697450c3dba3c295
    waitForConnections: true, // Ensure connections are available
    connectionLimit: 10, // Adjust based on your needs
    queueLimit: 0 // No limit on the number of queued connections
});

// Test the connection
db.getConnection()
  .then(connection => {
      console.log('Connected to the MySQL database.');
      connection.release(); // Release the connection back to the pool
  })
  .catch(err => {
      console.error('Error connecting to the MySQL database:', err.message);
      process.exit(1); // Exit the process with an error code
  });

module.exports = db;
