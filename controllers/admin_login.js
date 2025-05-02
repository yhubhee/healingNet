const db = require('../database');
const bcrypt = require('bcryptjs');
const { Admin_create_Token } = require('../middlewares/admin_auth');

exports.admin_login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('admin/admin_login', {
            error: `Please input Email/Password`,
        });
    }

    db.query(`SELECT * FROM admins WHERE email = ?`, [email], async (err, result) => {
        if (err) {
            console.log(err);
            return res.render('admin/admin_login', {
                error: 'Something went wrong. Please try again later.',
            });
        }

        if (!result[0] || !(await bcrypt.compare(password, result[0].password))) {
            return res.render('admin/admin_login', {
                error: `Invalid Email or password`,
            });
        }

        const admin = result[0];
        const adminToken = Admin_create_Token(admin);

        res.cookie('Doc-access-Token', adminToken, {
            maxAge: process.env.admin_JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });

        res.render('admin/admin_login',{
            success: "Login successful",
            redirect : true
        })
    });
};



