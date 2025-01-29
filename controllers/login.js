const db = require('../database');
const bcrypt = require('bcryptjs');
const { createToken } = require('../middlewares/auth');

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', {
            error: `Please input Email/Password`,
        });
    }

    db.query(`SELECT * FROM patients WHERE email = ?`, [email], async (err, result) => {
        if (err) {
            console.log(err);
            return res.render('login', {
                error: 'Something went wrong. Please try again later.',
            });
        }

        if (!result[0] || !(await bcrypt.compare(password, result[0].password))) {
            return res.render('login', {
                error: `Invalid Email or password`,
            });
        }

        const patient = result[0];
        const accessToken = createToken(patient);

        res.cookie('access-Token', accessToken, {
            maxAge: process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });

        res.status(200).redirect('/dashboard');
    });
};
// Compare this snippet from middlewares/authdoctor.js:

