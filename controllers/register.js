const pool = require('../database')
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage });

exports.register = (req, res) => {
    const {firstname, lastname,  phone, email, date_of_birth, gender, password} = req.body;
    // console.log(req.body);

    pool.query('select email from patients where email = ?', [email], async (err, result) => {
        if (err) {
            console.log(err);

        } else if (result.length > 0) {
            return res.render('ui/signup', {
                error: 'Email Already Exist'
            })
        // } else if (password !== confirmpassword) {
        //     return res.render('signup', {
        //         error: 'Password Do Not Match'
        //     })
        }
        else if (!password || password.length < 8) {
            return res.render('ui/signup', {
                error: `Password weak or are empty`
            })
        } else if (!email) {
            return res.render('ui/signup', {
                error: `Email field is empty`
            })
        } else if (!date_of_birth) {
            return res.render('ui/signup', {
                error: `Date of Birth field can't empty`
            })
        }
        const hashedpassword = await bcrypt.hash(password, 8)
        // const tokens = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        pool.query(`insert into patients set ?`, { firstname: firstname, lastname: lastname,
              phone: phone, email: email, date_of_birth: date_of_birth, gender: gender,  password: hashedpassword,status:"active"}, async (err, result) => {
            if (err) {
                console.log(err);

            } else {
                res.render('ui/signup', {
                    success: 'Registration Completed ✅ ',
                    redirect: true
                })
            }
        })
    })
}

exports.doctorregister = (req, res) => {
    upload.single('doc_img')(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.render('admin/add_doctor', {
                error: 'Failed to upload image'
            });
        }

        const { name, specialty, email, phone, address, password, gender, date_joined, about_doctor, status } = req.body;
        const doc_img = req.file ? req.file.filename : null;

        pool.query('select email from doctors where email = ?', [email], async (err, result) => {
            if (err) {
                console.log(err);
            } else if (result.length > 0) {
                return res.render('admin/add_doctor', {
                    error: 'Email Already Exist'
                });
            } else if (!email) {
                return res.render('admin/add_doctor', {
                    error: `Email field is empty`
                });
            }

            const hashedpassword = await bcrypt.hash(password, 8);

            pool.query(`insert into doctors set ?`, {
                name: name,
                specialty: specialty,
                date_joined: date_joined,
                phone: phone,
                email: email,
                gender: gender,
                password: hashedpassword,
                address: address,
                about_doctor: about_doctor,
                status: 'active',
                doc_img: doc_img
            }, async (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.render('admin/doctor_list', {
                        success: `Successfully registered Dr. ${name}`,
                        redirect: true
                    });
                }
            });
        });
    });
};