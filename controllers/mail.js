const nodemailer = require('nodemailer');
const db = require('../database');
require('dotenv').config();

exports.sendmail = (req, res) => {
    const { fullname, email, subject, message } = req.body

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
}
    });

    // Define email content
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: subject,
        html: `
                <p>From ${fullname}</p>
                <p>${message}></p>
              `
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.render('contact', {
                error: 'Failed to send email. Please try again later.',
            });
        }

        console.log('Email sent:', info.response);
        return res.render('contact', {
            success: 'Email sent successfull',
        });
    });
}

