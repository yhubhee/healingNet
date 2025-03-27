const express = require('express');
const router = express.Router();
const db = require('../database');
const { validateTokens } = require('../middlewares/auth');
const { doctorvalidateTokens } = require('../middlewares/authdoctor');
const { validatePasswordResetToken } = require('../middlewares/auth');
const { validateDoctor_reset_secret } = require('../middlewares/authdoctor');
const { symptoms } = require('../controllers/symptomChecker');

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
// console.log('Symptoms:', symptoms)
router.get('/symptom_checker', (req, res) => {
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
    res.render('symptom_checker', {
        symptomList: symptomList,
        // error: null
    });
});
router.get('/symptom_results', (req, res) => {
    res.render('symptom_results')
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

// Patients
router.get('/booked-appointment', validateTokens, (req, res) => {
    const { firstname, lastname, patient_id } = req.user; // Access the attached names and user_id
    const sql = `
       select a.doctor, d.department, a.illness, a.fullname, a.appointment_date, a.appointment_time, d.email,a.appointment_id, a.doctor_id, a.status from appointment a join doctors d on a.doctor_id = d.doctor_id WHERE patient_id = ? ;
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
    const date = new Date().toISOString().split('T')[0];
    const { firstname, lastname, patient_id } = req.user; // Access the attached names

    const sql = 'SELECT COUNT(*) AS count FROM appointment WHERE patient_id = ? AND status = "Scheduled" AND appointment_date = ?';

    const sql2 = `SELECT CONCAT(d.firstname, ' ', d.lastname) AS fullname, a.date_prescribed FROM doctors d JOIN prescriptions a ON d.doctor_id = a.doctor_id JOIN patients p ON a.patient_id = p.patient_id WHERE p.patient_id =  ? AND a.status = "prescribed" ORDER BY fullname ASC limit 1;`

    db.query(sql, [patient_id, date], (err, results1) => {
        if (err) {
            console.log('Database query error:', err);
            return res.status(500).json({ error: 'Failed to fetch appointments' });
        }

        db.query(sql2, [patient_id], (error, result2) => {
            if (error) {
                console.log('Database query error:', error);
                return res.status(500).json({ error: 'Failed to fetch prescriptions' });
            }
            let prescriptions = "Your prescription has been given no prescription yet.";
            if(result2.length > 0){
                prescriptions = `Your prescription has been updated by Dr. ${result2[0].fullname} on ${result2[0].date_prescribed}`;
            }
            console.log(result2);

            const appointmentsNumber = results1[0].count || "no";
            res.render('dashboard', {
                firstname,
                lastname,
                appointmentsNumber,
                prescriptions

            });
        });
    });
});
router.get('/prescriptions', validateTokens, (req, res) => {
    const { patient_id } = req.user;
    const sql = `SELECT pr.medication, pr.dosage, pr.frequency, pr.instructions, pr.date_prescribed, pr.start_date, pr.end_date, pr.prescriptions_id, pr.status, CONCAT(d.firstname, ' ', d.lastname) AS fullname, a.illness, d.doctor_id FROM doctors d JOIN prescriptions pr ON d.doctor_id = pr.doctor_id JOIN appointment a ON pr.patient_id = a.patient_id WHERE pr.patient_id = ?;`

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch prescription');
        }
        connection.query(sql, [patient_id], (err, results) => {
            console.log(patient_id) // Doctor_id 
            connection.release();
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Failed to fetch prescription');
            }
            res.render('prescriptions', {
                prescription: results || [],
            });
        });
    });

})

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
// Password reset
router.get('/Doc_forgot_pass', (req, res) => {
    res.render('Doc_forgot_pass');
});
router.get('/Doc_reset_pass', validateDoctor_reset_secret, (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.render('Doc_forgot_pass');
    }
    res.render('Doc_reset_pass', { token: token });
});
// Patients
router.get('/doc_patients', doctorvalidateTokens, (req, res) => {
    const { doctor_id } = req.user;
    const sql = `SELECT CONCAT(p.firstname, ' ', p.lastname) AS patientname, p.phone, p.email, p.date_of_birth, p.gender, p.address, p.patient_id, a.status FROM patients p JOIN appointment a ON p.patient_id = a.patient_id JOIN doctors d ON a.doctor_id = d.doctor_id WHERE d.doctor_id = ? AND a.status = "Scheduled";`

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch patients');
        }
        connection.query({ sql }, [doctor_id], (err, results) => {
            console.log(doctor_id) // Doctor_id 
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Failed to fetch patients');
            }
            res.render('doc_patients', {
                patients: results || [],
            });
        });
    });

})
// Prescription
router.get('/doc_prescription', doctorvalidateTokens, (req, res) => {
    const { doctor_id } = req.user;

    // Query for prescriptions
    const sql1 = `
        SELECT a.medication, a.dosage, a.frequency, a.instructions, a.date_prescribed, a.start_date, a.end_date, a.prescriptions_id, a.status, p.symptoms, CONCAT(p.firstname, ' ', p.lastname) AS fullname, p.patient_id FROM patients p JOIN prescriptions a ON p.patient_id = a.patient_id WHERE a.doctor_id = ?;
    `;

    // Query for patients with scheduled appointments
    const sql2 = `
   SELECT CONCAT(p.firstname, ' ', p.lastname) AS fullname, p.patient_id, p.symptoms FROM patients p JOIN appointment a ON p.patient_id = a.patient_id JOIN doctors d ON a.doctor_id = d.doctor_id WHERE d.doctor_id = ? AND a.status = "Scheduled";
    `

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch Prescription');
        }

        // Execute the first query (prescriptions)
        connection.query(sql1, [doctor_id], (err, prescriptions) => {
            if (err) {
                console.error('Database query error for prescriptions:', err);
                connection.release();
                return res.status(500).send('Failed to fetch Prescription');
            }

            // Execute the second query (patients)
            connection.query(sql2, [doctor_id], (err, patients) => {
                connection.release(); // Release connection after both queries
                if (err) {
                    console.error('Database query error for patients:', err);
                    return res.status(500).send('Failed to fetch Prescription');
                }

                // Render the template with separate data
                res.render('doc_prescription', {
                    doc_prescription: prescriptions || [],
                    patients: patients || [],
                });
            });
        });
    });
});
// Dashboard
router.get('/doctordashboard', doctorvalidateTokens, (req, res) => {
    const date = new Date().toISOString().split('T')[0];
    // console.log(date)
    const { firstname, lastname, doctor_id } = req.user; // Access the attached names

    const sql1 = 'SELECT COUNT(*) AS count FROM appointment WHERE doctor_id = ? AND status = "Scheduled" AND appointment_date = ?';

    const sql2 = `SELECT COUNT(DISTINCT a.patient_id) AS COUNT, CONCAT(p.firstname, ' ', p.lastname) AS patientname, p.phone, p.email, p.date_of_birth, p.gender, p.address, p.patient_id, a.status FROM patients p JOIN appointment a ON p.patient_id = a.patient_id JOIN doctors d ON a.doctor_id = d.doctor_id WHERE d.doctor_id = ? AND a.status = "Scheduled"`;

    const sql3 = `SELECT appointment_date FROM appointment WHERE appointment_date > ? AND status = "Scheduled " ORDER BY appointment_date ASC LIMIT 1`;

    db.query(sql1, [doctor_id, date], (err, result1) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Failed to fetch appointments' });
        }

        db.query(sql2, [doctor_id], (err, result2) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ error: 'Failed to fetch appointments' });
            }

            db.query(sql3, [date], (err, result3) => {
                if (err) {
                    console.error('Database query error:', err);
                    return res.status(500).json({ error: 'Failed to fetch appointments' });
                }

                let nextAppointmentMessage = "You have no upcoming appointments.";
                if (result3.length > 0) {
                    const nextAppointmentDate = new Date(result3[0].appointment_date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Normalize to midnight
                    nextAppointmentDate.setHours(0, 0, 0, 0); // Normalize to midnight
                    const timeDiff = nextAppointmentDate - today;
                    console.log(timeDiff)
                    const daysUntilAppointment = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

                    if (daysUntilAppointment === 0) {
                        nextAppointmentMessage = "Your next appointment is today.";
                    } else if (daysUntilAppointment > 0) {
                        nextAppointmentMessage = `Your next appointment is in ${daysUntilAppointment} days.`;
                    }
                }
                const patient_count = result2[0].COUNT || "no";
                const doc_appointmentsCount = result1[0].count || "no";

                res.render('doctordashboard', {
                    firstname,
                    lastname,
                    doc_appointmentsCount,
                    patient_count,
                    upcomingappointment: nextAppointmentMessage
                });
            });
        });
    });
});
// Doctor Appointment
router.get('/doc_appointment', doctorvalidateTokens, (req, res) => {
    const { firstname, lastname, doctor_id } = req.user; // Access the attached names and user_id
    const sql = `
    select a.fullname, a.email, a.appointment_date, a.appointment_time, a.appointment_id, a.patient_id, a.illness, a.status from appointment a join patients p on a.patient_id = p.patient_id JOIN doctors d ON a.doctor_id = d.doctor_id WHERE d.doctor_id = 10 AND a.status = "Scheduled"; 
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
// Doctor Schedule
router.get('/doc_schedule', doctorvalidateTokens, (req, res) => {

    res.render('doc_schedule')

})
module.exports = router;

