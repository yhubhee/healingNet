const { sign, verify } = require("jsonwebtoken");
const db = require('../database'); 
// Password reset tokens
const password_reset_secret = (patients) => {
    const password_reset = sign(
        {
            patient_id: patients.patient_id,
        },
        process.env.password_reset_secret,
        {
            expiresIn: process.env.password_reset_EXPIRES_IN
        }
    );

    return password_reset;
};

const validatePasswordResetToken = (req, res, next) => {
    const passwordResetToken = req.query.token || req.body.token; // Must be first
    console.log('Received token from auth:', passwordResetToken);
    if (!passwordResetToken) {
        return res.render('forgot_pass', { error: 'Missing token' });
    }
    try {
        const decoded = verify(passwordResetToken, process.env.password_reset_secret);
        req.authenticated = true;
        req.user = decoded;
        return next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.render('ui/forgot_pass', { error: 'Reset token has expired. Please request a new one.' });
        }
        return res.render('ui/login', { error: 'Invalid token. Please try again.' });
    }
};

// Login Tokens
const createToken = (patients) => {
    const accessToken = sign(
        {
            patient_id: patients.patient_id,
            firstname: patients.firstname,
            lastname: patients.lastname
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );

    return accessToken;
};

const validateTokens = (req, res, next) => {
    const accessToken = req.cookies['access-Token'];

    // Check if token exists
    if (!accessToken) {
        return res.render('ui/login', {
            error: 'User not authenticated'
        });
    }

    // Check if token is blacklisted
    db.query(`SELECT * FROM token_blacklist WHERE token = ?`, [accessToken], (err, result) => {
        if (err) {
            console.error('Error checking token blacklist:', err);
            return res.render('ui/login', {
                error: 'An error occurred. Please try again.'
            });
        }
        if (result.length > 0) {
            return res.render('ui/login', {
                error: 'Your session has been invalidated. Please log in again.'
            });
        }

        // Verify the token
        try {
            const validToken = verify(accessToken, process.env.JWT_SECRET);
            req.authenticated = true;
            req.user = validToken; 
            return next();
        } catch (err) {
            console.log(err)
            return res.render('ui/login', {
                error: 'Invalid token, please log in again.'
            });
        }
    });
};



module.exports = { createToken, validateTokens, password_reset_secret, validatePasswordResetToken};



