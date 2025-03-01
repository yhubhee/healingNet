const db = require('../database');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); 
require('dotenv').config(); 
const { password_reset_secret } = require('../middlewares/auth');

exports.forgot_pass = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.render('forgot_pass', {
            error: 'Please input email to continue',
        });
    }

    db.query(`SELECT * FROM patients WHERE email = ?`, [email], (err, result) => {
        if (err) {
            console.error(err);
            return res.render('forgot_pass', {
                error: 'Something went wrong. Please try again later.',
            });
        }

        if (result.length === 0) {
            return res.render('forgot_pass', {
                error: 'Invalid email',
            });
        }

        const patient = result[0];
        const resetToken = password_reset_secret(patient); // Generate reset token
        const resetLink = `http://localhost:3000/reset_pass?token=${resetToken}`;
        console.log('Generated token:', resetToken);

        // Set up Nodemailer transporter with custom SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',     
            port: process.env.EMAIL_PORT || 587,  // Use port 587
            secure: process.env.EMAIL_SECURE === 'true', // Convert string to boolean
            auth: {
                user: process.env.EMAIL_USER,  
                pass: process.env.EMAIL_PASS,  
            },
            tls: {
                rejectUnauthorized: false // Allow self-signed certificates
            }
        });

        // Define email content
        const mailOptions = {
            from: process.env.EMAIL_USER,      
            to: email,                         
            subject: 'HealingNet Password Reset Request',
            html: `
            <h2>Reset Your Password</h2>
            <p>Hello,</p>
            <p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>
            <p>— Your Telemedicine Team</p>
          `
        };
       

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.render('forgot_pass', {
                    error: 'Failed to send reset email. Please try again later.',
                });
            }

            console.log('Email sent:', info.response);
            return res.render('forgot_pass', {
                success: 'A password reset link has been sent to your email',
                redirect: true,
            });
        });
    });
};

exports.reset_pass = async (req, res) => {
    console.log('req.user:', req.user);
    const { password, confirmpassword } = req.body;
    const { patient_id } = req.user; // From validated token

    if (password !== confirmpassword) {
        return res.render('reset_pass', {
            error: 'Passwords do not match',
        });
    }

    if (!confirmpassword || confirmpassword.length < 8) {
        return res.render('reset_pass', {
            error: 'Password must be at least 8 characters long',
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(confirmpassword, 8);
        db.query(
            'UPDATE patients SET password = ? WHERE patient_id = ?',
            [hashedPassword, patient_id]
        );

        return res.render('reset_pass', {
            success: 'Password changed successfully ✅',
            redirect: true,
        });
    } catch (err) {
        console.error(err);
        return res.render('reset_pass', {
            error: 'Something went wrong. Please try again.',
        });
    }
};