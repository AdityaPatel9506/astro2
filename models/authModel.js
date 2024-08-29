const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const secretKey = process.env.JWT_SECRET;

// Register a new user
const registerUser = async (name, email, password) => {
    try {
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        return { id: result.insertId };
    } catch (error) {
        throw error;
    }
};

const loginUser = async (email, password) => {
    try {
        
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            throw new Error('User not found');
        }

        const foundUser = users[0];

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

    
        const token = jwt.sign(
            { id: foundUser.id, email: foundUser.email },
            secretKey,
            { expiresIn: '10h' }
        );

        // Return the token
        return { token };
    } catch (error) {
        throw error; // Propagate the error to be handled by the calling function
    }
};
// Verify JWT token
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyToken,
};
