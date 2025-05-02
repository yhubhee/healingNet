const { sign, verify } = require("jsonwebtoken");
// Login Tokens
const Admin_create_Token = (admin) => {
    const adminToken = sign(
        {
            admin_id: admin.admin_id,
            firstname: admin.firstname,
            lastname: admin.lastname
        },
        process.env.admin_JWT_SECRET,
        {
            expiresIn: process.env.admin_JWT_EXPIRES_IN
        }
    );

    return adminToken;
};

const Admin_validate_Tokens = (req, res, next) => {
    const adminToken = req.cookies["Doc-access-Token"];

    if (!adminToken) {
        return res.render('admin/admin_login', {
            error: 'User not authenticated',
        });
    }

    try {
        const validToken = verify(adminToken, process.env.admin_JWT_SECRET);
        if (validToken) {
            req.authenticated = true;
            req.user = validToken; // Attach user data to the request
            return next();
        }
    } catch (err) {
        return res.render('admin/admin_login', {
            error: 'Invalid token, please log in again.',
        });
    }
};


module.exports = { Admin_create_Token, Admin_validate_Tokens }