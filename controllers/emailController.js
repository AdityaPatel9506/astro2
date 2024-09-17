const sendEmails = require('../services/emailServices');

const sendEmail = async (req, res) => {
    console.log("email controller called");
    
    const { firstName, lastName, mobile, email, message } = req.body;

    // Email details for the user
    const userSubject = 'Thank you for contacting us!';
    const userText = `Dear ${firstName} ${lastName},\n\nThank you for reaching out to us. We have received your message and will get back to you shortly.\n\nBest regards,\nAcharyaAstro`;

    // Email details for the admin
    const adminSubject = 'New Query from Contact Us Form';
    const adminText = `New query from:\n\nFirst Name: ${firstName}\nLast Name: ${lastName}\nMobile No.: ${mobile}\nEmail: ${email}\nMessage: ${message}`;

    try {
        const { userSuccess, adminSuccess } = await sendEmails(
            email,
            userSubject,
            userText,
            'adityapatel9506@gmail.com',
            adminSubject,
            adminText
        );

        if (userSuccess && adminSuccess) {
            res.status(200).json({ message: 'Emails sent successfully!' });
        } else {
            res.status(500).json({ message: 'Failed to send emails' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error sending emails', error: error.message });
    }
};

module.exports = { sendEmail };
