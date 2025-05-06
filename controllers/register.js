const pool = require('../database');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

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
    const { firstname, lastname, phone, email, date_of_birth, gender, password } = req.body;

    pool.query('SELECT email FROM patients WHERE email = ?', [email], async (err, result) => {
        if (err) {
            console.log(err);
            return res.render('ui/signup', { error: 'Database error' });
        }

        if (result.length > 0) {
            return res.render('ui/signup', { error: 'Email Already Exist' });
        }

        if (!password || password.length < 8) {
            return res.render('ui/signup', { error: 'Password weak or empty' });
        }

        if (!email) {
            return res.render('ui/signup', { error: 'Email field is empty' });
        }

        if (!date_of_birth) {
            return res.render('ui/signup', { error: 'Date of Birth field is empty' });
        }

        const hashedpassword = await bcrypt.hash(password, 8);

        pool.query('INSERT INTO patients SET ?', {
            firstname,
            lastname,
            phone,
            email,
            date_of_birth,
            gender,
            password: hashedpassword,
            status: 'active'
        }, (err) => {
            if (err) {
                console.log(err);
                return res.render('ui/signup', { error: 'Database error' });
            }

            res.render('ui/signup', {
                success: 'Registration Completed ✅',
                redirect: true
            });

            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            res.render('emails/patient_email', {
                name: firstname && lastname,
            }, (err, html) => {
                if (err) {
                    console.error('Error rendering email template:', err);
                    return;
                }

                const mailOptions = {
                    from: 'HealingNet',
                    to: email,
                    subject: 'Welcome To HealingNet',
                    html
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
            });
        });
    });
};

exports.doctorregister = (req, res) => {
    upload.single('doc_img')(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.render('admin/add_doctor', { error: 'Failed to upload image' });
        }

        const { doc_name, specialty, email, phone, address, password, gender, date_joined, about_doctor } = req.body;
        const doc_img = req.file ? req.file.filename : null;

        pool.query('SELECT email FROM doctors WHERE email = ?', [email], async (err, result) => {
            if (err) {
                console.log(err);
                return res.render('admin/add_doctor', { error: 'Database error' });
            }

            if (result.length > 0) {
                return res.render('admin/add_doctor', { error: 'Email Already Exist' });
            }

            if (!email) {
                return res.render('admin/add_doctor', { error: 'Email field is empty' });
            }

            const hashedpassword = await bcrypt.hash(password, 8);

            pool.query('INSERT INTO doctors SET ?', {
                doc_name,
                specialty,
                date_joined,
                phone,
                email,
                gender,
                password: hashedpassword,
                address,
                about_doctor,
                status: 'active',
                doc_img
            }, (err) => {
                if (err) {
                    console.log(err);
                    return res.render('admin/add_doctor', { error: 'Database error' });
                }

                const sql = 'SELECT doctor_id, name, specialty, email, phone, gender, address, status FROM doctors';
                const sql2 = 'SELECT COUNT(*) AS count FROM doctors';

                pool.getConnection((err, connection) => {
                    if (err) {
                        console.error('Database connection error:', err);
                        return res.status(500).send('Failed to fetch Doctors');
                    }

                    pool.query(sql, (err, Doc_result) => {
                        if (err) {
                            console.error('Database query error:', err);
                            connection.release();
                            return res.status(500).send('Failed to fetch Doctors');
                        }

                        pool.query(sql2, (err, count_Result) => {
                            connection.release();
                            if (err) {
                                console.error('Database query error:', err);
                                return res.status(500).send('Failed to fetch Doctors');
                            }

                            const total_doc = count_Result[0].count || 'no';
                            res.render('admin/doctor_list', {
                                success: `Successfully registered Dr. ${name}`,
                                redirect: true,
                                doc_lists: Doc_result || [],
                                total_doc
                            });

                            const transporter = nodemailer.createTransport({
                                host: process.env.EMAIL_HOST,
                                port: process.env.EMAIL_PORT,
                                secure: process.env.EMAIL_SECURE,
                                auth: {
                                    user: process.env.EMAIL_USER,
                                    pass: process.env.EMAIL_PASS
                                },
                                tls: {
                                    rejectUnauthorized: false
                                }
                            });

                            res.render('emails/doctor_welcome_email', {
                                doctor_name: name,
                                doctor_email: email,
                                temporary_password: password
                            }, (err, html) => {
                                if (err) {
                                    console.error('Error rendering email template:', err);
                                    return;
                                }

                                const mailOptions = {
                                    from: 'HealingNet',
                                    to: email,
                                    subject: 'Congratulations On Your New Job',
                                    html
                                };

                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        console.error('Error sending email:', error);
                                    } else {
                                        console.log('Email sent:', info.response);
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};