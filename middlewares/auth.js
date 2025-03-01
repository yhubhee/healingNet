const { sign, verify } = require("jsonwebtoken");

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
    const passwordResetToken = req.body.token; // Must be first
    console.log('Received token:', passwordResetToken);
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
            return res.render('forgot_pass', { error: 'Reset token has expired. Please request a new one.' });
        }
        return res.render('login', { error: 'Invalid token. Please try again.' });
    }
};

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
    const accessToken = req.cookies["access-Token"];

    if (!accessToken) {
        return res.render('login', {
            error: 'User not authenticated',
        });
    }

    try {
        const validToken = verify(accessToken, process.env.JWT_SECRET);
        if (validToken) {
            req.authenticated = true;
            req.user = validToken; // Attach user data to the request
            return next();
        }
    } catch (err) {
        return res.render('login', {
            error: 'Invalid token, please log in again.',
        });
    }
};


module.exports = { createToken, validateTokens, password_reset_secret, validatePasswordResetToken};



