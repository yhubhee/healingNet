const { sign, verify } = require("jsonwebtoken");

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
    const passwordResetToken = req.body.password_reset_token; // Adjust based on source
    if (!passwordResetToken) {
        return res.render('forgot_pass', { error: 'Missing token' });
    }
    try {
        const decoded = verify(passwordResetToken, process.env.password_reset_secret);
        req.authenticated = true;
        req.user = decoded;
        return next();
    } catch (err) {
        return res.render('login', { error: 'Invalid or expired token, please try again.' });
    }
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



