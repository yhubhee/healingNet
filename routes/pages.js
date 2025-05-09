const express = require('express');
const router = express.Router();
const db = require('../database');
const { Admin_validate_Tokens } = require('../middlewares/admin_auth')
const { validateTokens } = require('../middlewares/auth');
const { doctorvalidateTokens } = require('../middlewares/authdoctor');
const { validatePasswordResetToken } = require('../middlewares/auth');
const { validateDoctor_reset_secret } = require('../middlewares/authdoctor');
const { symptoms } = require('../controllers/symptomChecker');

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
router.get('/ui/donations', (req, res) => {
    res.render('ui/donations');
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
// router.get('/ui/detail', (req, res) => {
//     res.render('ui/detail');
// });
// router.get('/ui/team', (req, res) => {
//     res.render('ui/team');
// });
router.get('/ui/search', (req, res) => {
    const sql1 = `SELECT doc_img, doc_name, specialty, about_doctor FROM doctors`;
    const sql2 = `SELECT doctor, status FROM appointment WHERE status = 'scheduled'`;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch doctors');
        }

        // Execute the first query to get doctors
        connection.query(sql1, (err, doctors) => {
            if (err) {
                console.error('Database query error:', err);
                connection.release(); // Release connection on error
                return res.status(500).send('Failed to fetch doctors');
            }

            // Execute the second query to get booked doctors
            connection.query(sql2, (err, isbooked) => {
                if (err) {
                    console.error('Database query error:', err);
                    connection.release(); // Release connection on error
                    return res.status(500).send('Failed to fetch booked doctors');
                }

                // Map over doctors and add isBooked property
                const bookedDoctors = new Set(isbooked.map(booking => booking.doctor)); // Create a Set of booked doctor names
                doctors.forEach(doctor => {
                    doctor.isBooked = bookedDoctors.has(doctor.doc_name); // Set isBooked true if doctor is in bookedDoctors
                });

                // Render the view with updated doctors array
                res.render('ui/search', {
                    doctors
                });

                // Release the connection after all queries and rendering
                connection.release();
            });
        });
    });
});
router.get('/ui/signup', (req, res) => {
    res.render('ui/signup');
});
router.get('/ui/login', validateTokens, (req, res) => {
    if (req.authenticated) {
        return res.redirect('/patients/dashboard'); 
    }
    res.render('ui/login');
});
router.get('/ui/appointment', (req, res) => {
    const sql1 = `SELECT doc_img, doc_name, specialty, about_doctor FROM doctors`;
    const sql2 = `SELECT doctor, status FROM appointment WHERE status = 'scheduled'`;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch doctors');
        }

        // Execute the first query to get doctors
        connection.query(sql1, (err, doctors) => {
            if (err) {
                console.error('Database query error:', err);
                connection.release(); // Release connection on error
                return res.status(500).send('Failed to fetch doctors');
            }

            // Execute the second query to get booked doctors
            connection.query(sql2, (err, isbooked) => {
                if (err) {
                    console.error('Database query error:', err);
                    connection.release(); // Release connection on error
                    return res.status(500).send('Failed to fetch booked doctors');
                }

                // Map over doctors and add isBooked property
                const bookedDoctors = new Set(isbooked.map(booking => booking.doctor)); // Create a Set of booked doctor names
                doctors.forEach(doctor => {
                    doctor.isBooked = bookedDoctors.has(doctor.doc_name); // Set isBooked true if doctor is in bookedDoctors
                });

                // Render the view with updated doctors array
                res.render('ui/appointment', {
                    doctors
                });

                // Release the connection after all queries and rendering
                connection.release();
            });
        });
    });
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

router.get('/ui/symptom_checker', validateTokens, (req, res) => {
    const { firstname, lastname } = req.user;

    const allSymptoms = new Set();

    Object.keys(symptoms).forEach(specialty => {
        const specialtyData = symptoms[specialty];
        Object.keys(specialtyData).forEach(diseaseOrCategory => {
            const data = specialtyData[diseaseOrCategory];
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
        symptomList,
        firstname,
        lastname,
    });
});
router.get('/ui/symptom_results', (req, res) => {
    res.render('ui/symptom_results')
});
router.get('/ui/reset_pass', validatePasswordResetToken, (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.render('forgot_pass', { error: 'Missing reset token' });
    }
    res.render('ui/reset_pass', { token: token });
});
//  Email Section
router.get('/emails/doctor_welcome_email', (req, res) => {
    res.render('emails/doctor_welcome_email');
});
router.get('/emails/patient_email', (req, res) => {
    res.render('emails/patient_email');
});

// Appointment
router.get('/ui/book_appointment', (req, res) => {
    const doctor = req.query.doctor || 'Unknown Doctor'; 
    const specialty = req.query.specialty || 'Unknown Specialty'; 
    res.render('ui/book_appointment', { 
        doctor,
        specialty 
    });
});

// Student Section
router.get('/student/student', (req, res) => {
    res.render('student/student')
})
router.get('/student/student_signup', (req, res) => {
    res.render('student/student_signup')
})
router.get('/student/student_login', (req, res) => {
    res.render('student/student_login')
})

// Patients Section
router.get('/patients/logout', (req, res) => {
    res.render('ui/login')
})
router.get('/patients/dashboard', validateTokens, (req, res) => {
    const { firstname, lastname, patient_id } = req.user; // Access the attached names
    const sql = 'SELECT COUNT(*) AS count FROM appointment WHERE patient_id = ?';

    db.query(sql, [patient_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err); // Debugging log
            return res.status(500).json({ error: 'Failed to fetch appointments' });
        }

        const appointmentsNumber = results[0].count || 'no';
        res.render('patients/dashboard', {
            firstname,
            lastname,
            appointmentsNumber,

        });
    });
});

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
       select a.doctor, d.specialty, a.fullname, a.appointmentDate, a.appointmentTime, d.email,a.appointment_id, a.doctor_id, a.status from appointment a join doctors d on a.doctor_id = d.doctor_id WHERE patient_id = ? ;
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
router.get('/patients/prescriptions', validateTokens, (req, res) => {
    const { firstname, lastname, patient_id } = req.user; // Access the attached names and user_id
    const sql = `
       select a.doctor, d.specialty, a.fullname, a.appointmentDate, a.appointmentTime, d.email,a.appointment_id, a.doctor_id, a.status from appointment a join doctors d on a.doctor_id = d.doctor_id WHERE patient_id = ? ;
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
            res.render('patients/prescriptions', {
                firstname,
                lastname,
                appointments: results || []
            });
        });
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
router.get('/doctor/doctordashboard', doctorvalidateTokens, (req, res) => {
    const today = new Date
    console.log(today)

    const doc_count = 'SELECT COUNT(*) AS count FROM appointment WHERE patient_id = ?';
    const sql = 'SELECT COUNT(*) AS count FROM appointment WHERE doctor_id = ?';

    const { name, doctor_id } = req.user; // Access the attached names

    db.query(sql, [doctor_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err); // Debugging log
            return res.status(500).json({ error: 'Failed to fetch appointments' });
        }

        const patient_count = results[0].count
        const doc_appointmentsCount = results[0].count;

        res.render('doctor/doctordashboard', {
            name,
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
    const { firstname, lastname } = req.user; // Access the attached names
    const sql1 = `SELECT COUNT(*) as count FROM doctors;`;
    const sql2 = `SELECT COUNT(*) AS count FROM patients`;
    const sql3 = `SELECT COUNT(*) AS count FROM appointment`;
    const sql4 = `SELECT COUNT(*) AS count FROM prescription`;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database query error:', err); // Debugging log
            return res.status(500).json({ error: 'Failed to fetch doctor totals' });
        }
        connection.query(sql1, (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                connection.release(); // Release connection on error
                return res.status(500).send('Failed to fetch Patients');
            }

            const total_doc = result[0].count || 'no';

            connection.query(sql2, (err, results) => {
                connection.release(); // Release connection after all queries
                if (err) {
                    console.error('Database query error:', err);
                    return res.status(500).send('Failed to count Patients');
                }

                const total_patient = results[0].count || 'no';

                connection.query(sql3, (err, results) => {
                    connection.release(); // Release connection after all queries
                    if (err) {
                        console.error('Database query error:', err);
                        return res.status(500).send('Failed to fetch appointment');
                    }

                    const total_appoint = results[0].count || 'no';

                    connection.query(sql4, (err, results) => {
                        connection.release(); // Release connection after all queries
                        if (err) {
                            console.error('Database query error:', err);
                            return res.status(500).send('Failed to fetch prescription');
                        }
                        const total_prescription = results[0].count || 'no';

                        console.log(total_patient);
                        res.render('admin/admin_dashboard', {
                            firstname,
                            lastname,
                            total_doc,
                            total_patient,
                            total_appoint,
                            total_prescription
                        });
                    });
                });
            });
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
router.get('/admin/doctor_list', (req, res) => {
    const sql = `SELECT doctor_id, doc_name, specialty, email, phone, gender, address, status FROM doctors`;
    const sql2 = `SELECT COUNT(*) AS count FROM doctors`;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch Doctors');
        }

        connection.query(sql, (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                connection.release(); // Release connection on error
                return res.status(500).send('Failed to fetch Doctors');
            }

            connection.query(sql2, (err, results) => {
                connection.release(); // Release connection after all queries
                if (err) {
                    console.error('Database query error:', err);
                    return res.status(500).send('Failed to fetch Doctors');
                }

                const total_doc = results[0].count || 'no';
                console.log(total_doc);
                res.render('admin/doctor_list', {
                    doc_lists: result || [],
                    total_doc,
                });
            });
        });
    });
});
router.get('/admin/patient_list', (req, res) => {
    const sql = `SELECT patient_id, CONCAT(firstname, ' ', lastname) AS name, email, phone, gender, address, status FROM patients;`;
    const sql2 = `SELECT COUNT(*) AS count FROM patients`;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch Patients');
        }

        connection.query(sql, (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                connection.release(); // Release connection on error
                return res.status(500).send('Failed to fetch Patients');
            }

            connection.query(sql2, (err, results) => {
                connection.release(); // Release connection after all queries
                if (err) {
                    console.error('Database query error:', err);
                    return res.status(500).send('Failed to fetch Patients');
                }

                const total_patient = results[0].count || 'no';
                console.log(total_patient);
                res.render('admin/patient_list', {
                    patient_lists: result || [],
                    total_patient,
                });
            });
        });
    });
});
router.get('/admin/prescription', (req, res) => {
    const sql = `Select drugs, dosage, note FROM prescription`;
    const sql2 = `SELECT COUNT(*) AS count FROM prescription`;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch prescription');
        }

        connection.query(sql, (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                connection.release(); // Release connection on error
                return res.status(500).send('Failed to fetch prescription');
            }

            connection.query(sql2, (err, results) => {
                connection.release(); // Release connection after all queries
                if (err) {
                    console.error('Database query error:', err);
                    return res.status(500).send('Failed to fetch Patients');
                }

                const total_prescription = results[0].count || '0';
                console.log(total_prescription);
                res.render('admin/prescription', {
                    prescriptions: results || [],
                    total_prescription,
                });
            });
        });
    });
});
router.get('/admin/admin_appointment', (req, res) => {
    const sql = `Select appointment_id, specialty, doctor, fullname, email, illness, appointment_date, appointment_time, status FROM appointment`;
    const sql2 = `SELECT COUNT(*) AS count FROM appointment`;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch appointment');
        }

        connection.query(sql, (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                connection.release(); // Release connection on error
                return res.status(500).send('Failed to fetch appointment');
            }

            connection.query(sql2, (err, results) => {
                connection.release(); // Release connection after all queries
                if (err) {
                    console.error('Database query error:', err);
                    return res.status(500).send('Failed to fetch appointment');
                }

                const total_appointment = results[0].count || '0';
                console.log(total_appointment);
                res.render('admin/admin_appointment', {
                    appointments: results || [],
                    total_appointment,
                });
            });
        });
    });
});



module.exports = router;