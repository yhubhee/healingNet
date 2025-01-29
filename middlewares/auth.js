const { sign, verify } = require("jsonwebtoken");

const createToken = (patients) => {
    const accessToken = sign(
        { patient_id: patients.patient_id, name: patients.firstname },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
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

module.exports = { createToken, validateTokens };

