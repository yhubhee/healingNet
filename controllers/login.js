const db = require('../database')
const bcrypt = require('bcryptjs')
const { createToken } = require('../middlewares/auth')


exports.login = (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body

    if (!email || !password) {
        return res.render('login', {
            error: `Please input Email/Password`
        })
    } else {

        
        const patients = db.query(`select * from patients where email = ? `, [email], async (err, result) => {
            if (err) {
                console.log(err);

            } 
            if (!result[0] || !await bcrypt.compare(password, result[0].password)) {
                return res.render(`login`, {
                    error: `Invalid Email or password`
                })
            }
            else {
                const accessToken = createToken(patients)

                res.cookie("access-Token", accessToken,{
                    maxage: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                })
                
                console.log('The token is: ' + accessToken);
                res.status(200).redirect('/dashboard');
            }
        })
    }
}


