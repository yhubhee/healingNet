// const mysql = require('mysql2');
const pool = require('../database')
const bcrypt = require('bcryptjs');

exports.register = (req, res) => {
    const {firstname, lastname,  phone, email, date_joined, date_of_birth, gender, password, confirmpassword, address, status} = req.body;
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
              phone: phone, email: email, date_joined: date_joined, date_of_birth: date_of_birth, gender: gender,  password: hashedpassword,  address: address, status:"Active"}, async (err, result) => {
            if (err) {
                console.log(err);

            } else {
                res.render('signup', {
                    success: 'Registration Completed ✅ ',
                    redirect: true
                })
            }
        })
    })
    // res.send(`from submitted`)
}

exports.doctorregister = (req, res) => {
    const { firstname, lastname, department, specialty, email, phone, date_of_birth, address, password, gender, confirmpassword, date_joined, status, HomeappointmentStatus} = req.body;
    // console.log(req.body);

    pool.query('select email from doctors where email = ?', [email], async (err, result) => {
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
        
        pool.query(`insert into doctors set ?`, { firstname: firstname, lastname: lastname, department: department, specialty: specialty, date_joined: date_joined, 
              phone: phone, email: email, date_of_birth: date_of_birth, gender: gender,  password: hashedpassword,  address: address, status:status, HomeappointmentStatus:HomeappointmentStatus}, async (err, result) => {
            if (err) {
                console.log(err);

            } else {
                res.render('doctorsignup', {
                    success: `Account successfully created for Dear ${lastname}` ,
                    redirect: true
                })
            }
        })
    })
}