const pool = require('../database')
const bcrypt = require('bcryptjs');

exports.admin_register = (req, res) => {
    const {firstname, lastname, email, password} = req.body;
    // console.log(req.body);

    pool.query('select email from admins where email = ?', [email], async (err, result) => {
        if (err) {
            console.log(err);

        } else if (result.length > 0) {
            return res.render('admin/admin_signup', {
                error: 'Email Already Exist'
            })
        }
        else if (!password || password.length < 8) {
            return res.render('admin/admin_signup', {
                error: `Password weak or are empty`
            })
        } else if (!email) {
            return res.render('admin/admin_signup', {
                error: `Email field is empty`
            })
        } 
        const hashedpassword = await bcrypt.hash(password, 8)
        // const tokens = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        pool.query(`insert into admins set ?`, { firstname: firstname, lastname: lastname,
              email: email, password: hashedpassword, status: 'active'}, async (err, result) => {
            if (err) {
                console.log(err);

            } else {
                res.render('admin/admin_signup', {
                    success: 'Registration Completed ✅ ',
                    redirect: true
                })
            }
        })
    })
}