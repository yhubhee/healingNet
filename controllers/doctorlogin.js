const db = require('../database')
const { createToken } = require('../middlewares/authdoctor')
const bcrypt = require('bcryptjs')


exports.doctorlogin = (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body

    if (!email || !password) {
        return res.render('doctor/doctorlogin', {
            error: `Please input Email/Password`
        })
    }

    db.query(`select * from doctors where email = ? `, [email], async (err, result) => {
        if (err) {
            console.log(err);

        }
        if (!result[0] || !await bcrypt.compare(password, result[0].password)) {
            return res.render('doctor/doctorlogin', {
                error: `Invalid Email or password`
            })
        }

        const doctors = result[0];
        const accessToken = createToken(doctors)

        res.cookie("doc-Token", accessToken, {
            maxage: new Date(
                Date.now() + process.env.Doc_JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: process.env.NODE_ENV
        })

        // console.log('The token is: ' + accessToken);
        res.render('doctor/doctorlogin',{
            success: "Login successful",
            redirect : true
        })

    })
}



