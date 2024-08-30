const authModel = require('../models/authModel');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const result = await authModel.registerUser(name, email, password);
        res.status(201).json({ id: result.id, message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    // Extract email and password from the request body
    const { email, password } = req.body;

    try {
        // Attempt to login the user by calling the model function
        const { token } = await authModel.loginUser(email, password);

        // Set the token in an HTTP-only cookie with security options
        res.cookie('gloum_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        // Respond with a success message
        res.status(200).json({ message: 'Login successful',token });
    } catch (error) {
        // If there's an error, respond with a 400 status and the error message
        res.status(400).json({ error: error.message });
    }
};



const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
};

module.exports = {
    register,
    login,
    logout,
};
