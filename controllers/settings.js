const db = require('../database');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); 
require('dotenv').config(); 

exports.settings = async (req, res) => {
    const { password, confirmpassword } = req.body ;
   
    const { patient_id } = req.user; // From validated token
    console.log('req.user:', req.user);

    if (password !== confirmpassword) {
        return res.render('patients/settings', {
            error: 'Passwords do not match',
        });
    }

    if (!confirmpassword || confirmpassword.length < 8) {
        return res.render('patients/settings', {
            error: 'Password must be at least 8 characters long',
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(confirmpassword, 8);
        db.query(
            'UPDATE patients SET password = ? WHERE patient_id = ?',
            [hashedPassword, patient_id]
        );

        return res.render('patients/settings', {
            token: token, 
            success: 'Password changed successfully ✅',
            redirect: true,
        });
    } catch (err) {
        console.error(err);
        return res.render('patients/settingss', {
            error: 'Something went wrong. Please try again.',
        });
    }
};