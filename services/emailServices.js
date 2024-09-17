require('dotenv').config(); // Ensure environment variables are loaded
const nodemailer = require('nodemailer');



// Create a transporter object using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASS  // Your Gmail password or App Password
    }
    
    
});

// Function to send an email
const sendEmail = async (to, subject, html, text) => {
    try {
        const mailOptions = {
            from: process.env.GMAIL_USER, // Sender address
            to: to,                       // List of receivers
            subject: subject,            // Subject line
            html: html,                  // HTML body
            text: text                   // Plain text body
        };

        const response = await transporter.sendMail(mailOptions);

        console.log('Email sent successfully:', response);
        return { success: true };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error: error.message };
    }
};

// Function to send both user and admin emails
const sendEmails = async (userEmail, userSubject, userText, adminEmail, adminSubject, adminText) => {
    const userResponse = await sendEmail(userEmail, userSubject, '', userText);
    const adminResponse = await sendEmail(adminEmail, adminSubject, '', adminText);

    return {
        userSuccess: userResponse.success,
        adminSuccess: adminResponse.success
    };
};

module.exports = sendEmails;
