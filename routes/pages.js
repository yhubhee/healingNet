const express = require('express');
const router = express.Router();
const db = require('../database');
const { validateTokens } = require('../middlewares/auth');
const { doctorvalidateTokens } = require('../middlewares/authdoctor');
const { validatePasswordResetToken } = require('../middlewares/auth');

router.get('/about', (req, res) => {
    res.render('about');
});
router.get('/service', (req, res) => {
    res.render('service');
});
// router.get('/service-details', (req, res) => {
//     res.render('service-details');
// });
router.get('/price', (req, res) => {
    res.render('price');
});
router.get('/testimonial', (req, res) => {
    res.render('testimonial');
});
router.get('/contact', (req, res) => {
    res.render('contact');
});
// router.get('/blog', (req, res) => {
//     res.render('blog');
// });
// router.get('/detail', (req, res) => {
//     res.render('detail');
// });
router.get('/team', (req, res) => {
    res.render('team');
});
router.get('/search', (req, res) => {
    res.render('search');
});
router.get('/logout', (req, res) => {
    res.render('login')
})
router.get('/features', (req, res) => {
    res.render('features');
});
router.get('/signup', (req, res) => {
    res.render('signup');
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/appointment', (req, res) => {
    res.render('appointment');
});
router.get('/homeappointment', (req, res) => {
    res.render('homeappointment');
});
router.get('/forgot_pass', (req, res) => {
    res.render('forgot_pass');
});
router.get('/reset_pass', validatePasswordResetToken, (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.render('forgot_pass', { error: 'Missing reset token' });
    }
    res.render('reset_pass', { token: token });
});
router.get('/profile', validateTokens, (req, res) => {
    const { patient_id } = req.user; // Access the attached names and user_id
    const sql = `
       select firstname, lastname, phone, email, date_joined, date_of_birth, gender, address from patients WHERE patient_id = ? ;
    `;
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch your details');
        }
        connection.query(sql, [patient_id], (err, results) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Failed to fetch your details');
            }
            res.render('profile', {
                patient: results || []
            });
        });
    });
});
router.get('/settings', validateTokens, (req, res) => {
    const { patient_id } = req.user; // Access the attached names and user_id
    const sql = `
       select firstname, lastname, phone, email, date_joined, date_of_birth, gender, address from patients WHERE patient_id = ? ;
    `;
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch your details');
        }
        connection.query(sql, [patient_id], (err, results) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Failed to fetch your details');
            }
            res.render('settings', {
                patient: results || []
            });
        });
    });
});

router.get('/booked-appointment', validateTokens, (req, res) => {
    const { firstname, lastname, patient_id } = req.user; // Access the attached names and user_id
    const sql = `
       select a.doctor, d.department, d.specialty, a.fullname, a.appointment_date, a.appointment_time, d.email,a.appointment_id, a.doctor_id, a.status from appointment a join doctors d on a.doctor_id = d.doctor_id WHERE patient_id = ? ;
    `;
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch appointments');
        }
        connection.query(sql, [patient_id], (err, results) => {
            connection.release(); // Release the connection back to the pool
            // console.log([patient_id]) // Patients id 
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Failed to fetch appointments');
            }
            res.render('booked-appointment', {
                firstname,
                lastname,
                appointments: results || []
            });
        });
    });
});

router.get('/dashboard', validateTokens, (req, res) => {
    const { firstname, lastname, patient_id } = req.user; // Access the attached names
    const sql = 'SELECT COUNT(*) AS count FROM appointment WHERE patient_id = ?';

    db.query(sql, [patient_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err); // Debugging log
            return res.status(500).json({ error: 'Failed to fetch appointments' });
        }
        const appointmentsNumber = results[0].count;
        res.render('dashboard', {
            firstname,
            lastname,
            appointmentsNumber
        });
    });
});

// Route to handle AJAX request for doctors
router.get('/getDoctors', (req, res) => {
    // Extract the 'department' query parameter from the request URL
    const department = req.query.department;

    console.log('Department:', department); // Debugging log

    const sql = 'SELECT doctor_id, firstname, lastname FROM doctors WHERE department = ?';
    db.query(sql, [department], (err, results) => {
        if (err) {
            console.error('Database query error:', err); // Debugging log
            return res.status(500).json({ error: 'Failed to fetch doctors' });
        }
        console.log('Query Results:', results); // Debugging log
        res.json({ doctors: results });
    });
});

// cancel appointment
router.post('/cancel-appointment', (req, res) => {
    const { appointment_id } = req.body;
    const query = 'UPDATE appointment SET status = "Cancelled" WHERE appointment_id = ?';

    db.query(query, [appointment_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }
        res.redirect('/booked-appointment');
    });
});


// Doctor Section
router.get('/doctorsignup', (req, res) => {
    res.render('doctorsignup');
});
router.get('/doctorlogin', (req, res) => {
    res.render('doctorlogin');
});
router.get('/doctorlogout', (req, res) => {
    res.render('doctorlogin')
})
router.get('/schedule', (req, res) => {
    res.render('schedule')
})
router.get('/doc_patients', doctorvalidateTokens, (req, res) => {
    const { doctor_id } = req.user;
    const sql = `SELECT  p.firstname, p.lastname, p.phone, p.email, p.date_of_birth, p.gender, p.address, p.patient_id  FROM patients p join appointment a on p.patient_id = a.patient_id Where doctor_id = ?;`

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch patients');
        }
        connection.query([sql], [doctor_id], (err, results) => {
            console.log(doctor_id) // Doctor_id 
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Failed to fetch patients');
            }
            res.render('doc_patients', {
                patients: results || [],
                patient_count
            });
        });
    });

})
router.get('/doctordashboard', doctorvalidateTokens, (req, res) => {
    const today = new Date
    console.log(today)
    const doc_count = 'SELECT COUNT(*) AS count FROM appointment WHERE patient_id = ?';
    const sql = 'SELECT COUNT(*) AS count FROM appointment WHERE doctor_id = ?';
    const { firstname, lastname, doctor_id } = req.user; // Access the attached names
    db.query(sql, [doctor_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err); // Debugging log
            return res.status(500).json({ error: 'Failed to fetch appointments' });
        }
        const patient_count = results[0].count
        const doc_appointmentsCount = results[0].count;
        res.render('doctordashboard', {
            firstname,
            lastname,
            doc_appointmentsCount,
            patient_count
        });
    })
});
router.get('/doc_appointment', doctorvalidateTokens, (req, res) => {
    const { firstname, lastname, doctor_id } = req.user; // Access the attached names and user_id
    const sql = `
    select a.fullname, a.email, a.appointment_date, a.appointment_time, a.appointment_id, a.patient_id, a.illness, a.status from appointment a join patients p on a.patient_id = p.patient_id Where doctor_id = ?; 
    `
    db.query(sql, [doctor_id], (err, results) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch appointments');
        }
        res.render('doc_appointment', {
            firstname,
            lastname,
            appointments: results || []
        });

    });
});

module.exports = router;

