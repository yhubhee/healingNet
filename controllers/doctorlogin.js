const db = require('../database')
const { createToken } = require('../middlewares/authdoctor')
const bcrypt = require('bcryptjs')


exports.doctorlogin = (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body

    if (!email || !password) {
        return res.render('doctorlogin', {
            error: `Please input Email/Password`
        })
    } else {

        
        const doctors = db.query(`select * from doctors where email = ? `, [email], async (err, result) => {
            if (err) {
                console.log(err);

            } 
            if (!result[0] || !await bcrypt.compare(password, result[0].password)) {
                return res.render('doctorlogin', {
                    error: `Invalid Email or password`
                })
            }
            else {
                const accessToken = createToken(doctors)

                res.cookie("doc-Token", accessToken,{
                    maxage: new Date(
                        Date.now() + process.env.Doc_JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                })
                
                console.log('The token is: ' + accessToken);
                res.status(200).redirect('/doctordashboard');
            }
        })
    }
}


