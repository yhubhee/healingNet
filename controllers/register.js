const mysql = require('mysql2');
const pool = require('../database')
const bcrypt = require('bcryptjs');

exports.register = (req, res) => {
    const {firstname, lastname,  phone, email, date_of_birth, gender, password, confirmpassword, address} = req.body;
    // console.log(req.body);

    pool.query('select email from patients where email = ?', [email], async (err, result) => {
        if (err) {
            console.log(err);

        } else if (result.length > 0) {
            return res.render('signup', {
                error: 'Email Already Exist'
            })
        } else if (password !== confirmpassword) {
            return res.render('signup', {
                error: 'Password Do Not Match'
            })
        }
        else if (!password || password.length < 8) {
            return res.render('signup', {
                error: `Password weak or are empty`
            })
        } else if (!email) {
            return res.render('signup', {
                error: `Email field is empty`
            })
        } else if (!date_of_birth) {
            return res.render('signup', {
                error: `Date of Birth field can't empty`
            })
        }
        const hashedpassword = await bcrypt.hash(password, 8)
        // const tokens = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        pool.query(`insert into patients set ?`, { firstname: firstname, lastname: lastname,
              phone: phone, email: email, date_of_birth: date_of_birth, gender: gender,  password: hashedpassword,  address: address,}, async (err, result) => {
            if (err) {
                console.log(err);

            } else {
                res.render('signup', {
                    message: 'Registration Completed ✅ ',
                    redirect: true
                })
            }
        })
    })
    // res.send(`from submitted`)
}

exports.doctorregister = (req, res) => {
    const { firstname, lastname, specialty, email, phone, date_of_birth, address, password, gender, confirmpassword, date_joined} = req.body;
    // console.log(req.body);

    pool.query('select email from patients where email = ?', [email], async (err, result) => {
        if (err) {
            console.log(err);

        } else if (result.length > 0) {
            return res.render('doctorsignup', {
                error: 'Email Already Exist'
            })
        } else if (password !== confirmpassword) {
            return res.render('doctorsignup', {
                error: 'Password Do Not Match'
            })
        }
        else if (!password || password.length < 8) {
            return res.render('doctorsignup', {
                error: `Password weak or are empty`
            })
        } else if (!email) {
            return res.render('doctorsignup', {
                error: `Email field is empty`
            })
        } else if (!date_of_birth) {
            return res.render('doctorsignup', {
                error: `Date of Birth field can't empty`
            })
        }
        const hashedpassword = await bcrypt.hash(password, 8)
        // const tokens = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        pool.query(`insert into doctors set ?`, { firstname: firstname, lastname: lastname, specialty: specialty, date_joined: date_joined, 
              phone: phone, email: email, date_of_birth: date_of_birth, gender: gender,  password: hashedpassword,  address: address,}, async (err, result) => {
            if (err) {
                console.log(err);

            } else {
                res.render('doctorsignup', {
                    message: `Account successfully created for Dear ${lastname}` ,
                    redirect: true
                })
            }
        })
    })
}