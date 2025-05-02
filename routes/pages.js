const express = require('express');
const router = express.Router();
const db = require('../database');
const {Admin_validate_Tokens} = require('../middlewares/admin_auth')
const { validateTokens } = require('../middlewares/auth');
const { doctorvalidateTokens } = require('../middlewares/authdoctor');
const { validatePasswordResetToken } = require('../middlewares/auth');
const { validateDoctor_reset_secret } = require('../middlewares/authdoctor');
const { symptoms} = require('../controllers/symptomChecker');

// BASIC UI SECTION
router.get('/ui/about', (req, res) => {
    res.render('ui/about');
});
router.get('/ui/individuals', (req, res) => {
    res.render('ui/individuals');
});
router.get('/ui/student', (req, res) => {
    res.render('ui/student');
});
router.get('/clinicians', (req, res) => {
    res.render('clinicians');
});

// router.get('/service-details', (req, res) => {
//     res.render('service-details');
// });
router.get('/ui/price', (req, res) => {
    res.render('ui/price');
});
router.get('/ui/testimonial', (req, res) => {
    res.render('ui/testimonial');
});
router.get('/ui/contact', (req, res) => {
    res.render('ui/contact');
});
// router.get('/blog', (req, res) => {
//     res.render('blog');
// });
router.get('/ui/detail', (req, res) => {
    res.render('ui/detail');
});
// router.get('/ui/team', (req, res) => {
//     res.render('ui/team');
// });
router.get('/ui/search', (req, res) => {
    res.render('ui/search');
});
router.get('/ui/signup', (req, res) => {
    res.render('ui/signup');
});
router.get('/ui/login', (req, res) => {
    res.render('ui/login');
});
router.get('/ui/appointment', (req, res) => {
    res.render('ui/appointment');
});
router.get('/ui/homeappointment', (req, res) => {
    res.render('ui/homeappointment');
});
router.get('/ui/premuim', (req, res) => {
    res.render('ui/premuim');
});
router.get('/ui/forgot_pass', (req, res) => {
    res.render('ui/forgot_pass');   
});
// console.log('Symptoms:', symptoms)
router.get('/ui/symptom_checker', (req, res) => {
    const allSymptoms = new Set();

    Object.keys(symptoms).forEach(department => {
        const departmentData = symptoms[department];
        Object.keys(departmentData).forEach(diseaseOrCategory => {
            const data = departmentData[diseaseOrCategory];
            if (data.common && data.less_common) {
                // Direct disease with symptoms
                if (Array.isArray(data.common)) {
                    data.common.forEach(symptom => allSymptoms.add(symptom));
                }
                if (Array.isArray(data.less_common)) {
                    data.less_common.forEach(symptom => allSymptoms.add(symptom));
                }
            } else {
                // Category with sub-diseases
                Object.keys(data).forEach(subDisease => {
                    const subData = data[subDisease];
                    if (subData.common && subData.less_common) {
                        if (Array.isArray(subData.common)) {
                            subData.common.forEach(symptom => allSymptoms.add(symptom));
                        }
                        if (Array.isArray(subData.less_common)) {
                            subData.less_common.forEach(symptom => allSymptoms.add(symptom));
                        }
                    }
                });
            }
        });
    });

    const symptomList = Array.from(allSymptoms).sort();
    res.render('ui/symptom_checker', {
        symptomList: symptomList,
        // error: null
    });
});
router.get('/ui/symptom_results', (req, res)=>{
    res.render('ui/symptom_results')
});
router.get('/ui/reset_pass', validatePasswordResetToken, (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.render('forgot_pass', { error: 'Missing reset token' });
    }
    res.render('ui/reset_pass', { token: token });
});

// Student Section
router.get('/student/student', (req, res) =>{
    res.render('student/student')
})
router.get('/student/student_signup', (req, res) =>{
    res.render('student/student_signup')
})
router.get('/student/student_login', (req, res) =>{
    res.render('student/student_login')
})
// Patients Section
router.get('/patients/logout', (req, res) => {
    res.render('ui/login')
})
router.get('/patients/profile', validateTokens, (req, res) => {
    const { patient_id } = req.user; // Access the attached names and user_id
    const sql = `
       select firstname, lastname, phone, email, date_joined, date_of_birth, gender, address, medical_history, medical_record_upload, emergency_contact, marital_status, chronic_conditions, next_of_kin from patients WHERE patient_id = ? ;
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
            res.render('patients/profile', {
                patient: results || []
            });
        });
    });
});
router.get('/patients/settings', validateTokens, (req, res) => {
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
            res.render('patients/settings', {
                patient: results || []
            });
        });
    });
});

router.get('/patients/booked-appointment', validateTokens, (req, res) => {
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
            res.render('patients/booked-appointment', {
                firstname,
                lastname,
                appointments: results || []
            });
        });
    });
});

router.get('/patients/dashboard', validateTokens, (req, res) => {
    const { firstname, lastname, patient_id } = req.user; // Access the attached names
    const sql = 'SELECT COUNT(*) AS count FROM appointment WHERE patient_id = ?';

    db.query(sql, [patient_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err); // Debugging log
            return res.status(500).json({ error: 'Failed to fetch appointments' });
        }
        
        const appointmentsNumber = results[0].count;
        res.render('patients/dashboard', {
            firstname,
            lastname,
            appointmentsNumber,
            
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
router.get('/doctor/doctorsignup', (req, res) => {
    res.render('doctor/doctorsignup');
});
router.get('/doctor/doctorlogin', (req, res) => {
    res.render('doctor/doctorlogin');
});
router.get('/doctorlogout', (req, res) => {
    res.render('doctorlogin')
})
router.get('/schedule', (req, res) => {
    res.render('schedule')
})
// Doctor Password reset
router.get('/doctor/Doc_forgot_pass', (req, res) => {
    res.render('doctor/Doc_forgot_pass');
});
router.get('/doctor/Doc_reset_pass', validateDoctor_reset_secret, (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.render('Doc_forgot_pass');
    }
    res.render('doctor/Doc_reset_pass', { token: token });
});
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

// Admin Section
router.get('/admin/admin_dashboard', Admin_validate_Tokens, (req, res) => {
    const { firstname, lastname, admin_id } = req.user; // Access the attached names?';

    db.query(admin_id , (err, results) => {
        if (err) {
            console.error('Database query error:', err);
        }
        res.render('admin/admin_dashboard', {
            firstname,
            lastname,
            
        });
    });
});

router.get('/admin/admin_signup', (req, res) => {
    res.render('admin/admin_signup');
});
router.get('/admin/admin_login', (req, res) => {
    res.render('admin/admin_login');
});
router.get('/admin/add_doctor', (req, res) => {
    res.render('admin/add_doctor');
});
module.exports = router;

