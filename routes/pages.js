const express = require('express');
const router = express.Router();
const db = require('../database');
const { Admin_validate_Tokens } = require('../middlewares/admin_auth')
const { validateTokens } = require('../middlewares/auth');
const { doctorvalidateTokens } = require('../middlewares/authdoctor');
const { validatePasswordResetToken } = require('../middlewares/auth');
const { validateDoctor_reset_secret } = require('../middlewares/authdoctor');
const { symptoms } = require('../controllers/symptomChecker');
const jwt = require('jsonwebtoken');

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
// router.get('/service-details', (req, res) => {
//     res.render('service-details');
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
router.get('/ui/appointment', (req, res) => {
    const sql1 = `SELECT DISTINCT doc_img, doc_name, specialty, about_doctor FROM doctors`;
    const sql2 = `SELECT doctor, appointmentDate, appointmentTime AS status FROM appointment WHERE status = 'scheduled' ORDER BY appointmentTime DESC`;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch doctors');
        }

        connection.query(sql1, (err, doctors) => {
            if (err) {
                console.error('Database query error:', err);
                connection.release();
                return res.status(500).send('Failed to fetch doctors');
            }

            const uniqueDoctors = Array.from(new Map(doctors.map(doc => [doc.doc_name, doc])).values());

            connection.query(sql2, (err, isbooked) => {
                if (err) {
                    console.error('Database query error:', err);
                    connection.release();
                    return res.status(500).send('Failed to fetch booked doctors');
                }

                // Create a map to store the most recent booking details for each doctor
                const latestBookings = new Map();
                if (isbooked && isbooked.length > 0) {
                    isbooked.forEach(booking => {
                        const currentLatest = latestBookings.get(booking.doctor);
                        const bookingDateTime = new Date(`${booking.appointmentDate}T${booking.status}`);
                        if (!currentLatest || bookingDateTime > new Date(`${currentLatest.date}T${currentLatest.time}`)) {
                            latestBookings.set(booking.doctor, {
                                date: booking.appointmentDate.toLocaleDateString(),
                                time: new Date(`1970-01-01T${booking.status}`).toLocaleTimeString()
                            });
                        }
                    });

                }


                // Add the most recent booked time and formatted message to each doctor
                const today = new Date();
                const todayStr = today.toISOString().split('T')[0]; // e.g., "2025-05-12"

                uniqueDoctors.forEach(doctor => {
                    const booking = latestBookings.get(doctor.doc_name);
                    if (booking) {
                        doctor.isBooked = true;
                        doctor.latestBookedTime = booking.time;
                        doctor.latestBookedDate = booking.date;
                        // Format the message based on whether the booking is today
                        if (booking.date === todayStr) {
                            doctor.bookedMessage = `Doctor is booked for ${booking.time} today`;
                        } else {
                            doctor.bookedMessage = `Doctor is booked for ${booking.time} on ${booking.date}`;
                        }
                    } else {
                        doctor.isBooked = false;
                        doctor.latestBookedTime = null;
                        doctor.latestBookedDate = null;
                        doctor.bookedMessage = null;
                    }
                });

                res.render('ui/appointment', {
                    doctors: uniqueDoctors
                });

                connection.release();
            });
        });
    });
});

router.get('/ui/book_appointment', (req, res) => {
    const doctor = req.query.doctor || 'Unknown Doctor';
    const specialty = req.query.specialty || 'Unknown Specialty';

    const sql1 = `SELECT DISTINCT doc_img, doc_name, specialty, about_doctor FROM doctors`;
    const sql2 = `SELECT doctor, appointmentTime AS status FROM appointment WHERE status = 'scheduled' ORDER BY appointmentTime DESC`;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch doctors');
        }

        connection.query(sql1, (err, doctors) => {
            if (err) {
                console.error('Database query error:', err);
                connection.release();
                return res.status(500).send('Failed to fetch doctors');
            }
            console.log(doctors)

            const uniqueDoctors = Array.from(new Map(doctors.map(doc => [doc.doc_name, doc])).values());

            connection.query(sql2, (err, isbooked) => {
                if (err) {
                    console.error('Database query error:', err);
                    connection.release();
                    return res.status(500).send('Failed to fetch booked doctors');
                }

                // Create a map to store the most recent booked time for each doctor
                const latestBookings = new Map();
                if (isbooked && isbooked.length > 0) {
                    isbooked.forEach(booking => {
                        const currentLatest = latestBookings.get(booking.doctor);
                        if (!currentLatest || new Date(booking.status) > new Date(currentLatest)) {
                            latestBookings.set(booking.doctor, booking.status);
                        }
                    });
                }

                // Add the most recent booked time to each doctor
                uniqueDoctors.forEach(doctor => {
                    doctor.latestBookedTime = latestBookings.get(doctor.doc_name) || null;
                    doctor.isBooked = doctor.latestBookedTime;
                });


                res.render('ui/book_appointment', {
                    doctor,
                    specialty,
                    doctors
                });

                connection.release();
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
        res.redirect('patients/booked-appointment');
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
    const token = req.cookies['access-Token'];

    if (token) {
        // Decode the token to get its expiration time
        const decoded = jwt.decode(token);
        console.log(decoded)
        const expiresAt = new Date(decoded.exp * 1000); // Convert expiration (in seconds) to Date

        // Add the token to the blacklist
        const blacklistQuery = `INSERT INTO token_blacklist (token, expires_at) VALUES (?, ?)`;
        db.query(blacklistQuery, [token, expiresAt], (err) => {
            if (err) {
                console.error('Error blacklisting token:', err);
                // Proceed with logout even if blacklisting fails
            }

            // Clear the JWT cookie
            res.clearCookie('access-Token', {
                httpOnly: true,
                secure: process.env.NODE_ENV,
            });

            // Render the login page
            res.render('ui/login', {
                success: 'You have been logged out successfully.',
                redirect: false
            });
        });
    } else {
        // No token found, proceed to render login page
        res.render('ui/login', {
            success: 'You have been logged out successfully.',
            redirect: false
        });
    }
});

router.get('/patients/dashboard', validateTokens, (req, res) => {
    const date = new Date().toISOString().split('T')[0];
    const { firstname, lastname, patient_id } = req.user;

    if (!patient_id) {
        return res.status(401).render('ui/login', {
            error: 'Authentication failed: No patient ID found. Please log in again.',
            firstname,
            lastname,
        });
    }

    const sql1 = `SELECT COUNT(*) AS count, d.doc_name FROM appointment a JOIN doctors d ON a.doctor_id = d.doctor_id WHERE a.patient_id = ? AND a.appointmentDate = ? AND a.status = 'scheduled'`;
    const completeProfileQuery = `SELECT * FROM patients 
                WHERE patient_id = ? AND (
                    (address IS NULL OR TRIM(address) = '') OR 
                    (emergency_contact_information IS NULL OR TRIM(emergency_contact_information) = '') OR 
                    (medical_conditions IS NULL OR TRIM(medical_conditions) = '') OR 
                    (allergies IS NULL OR TRIM(allergies) = '') OR 
                    (medications IS NULL OR TRIM(medications) = '') OR 
                    (surgical_history IS NULL OR TRIM(surgical_history) = '') OR 
                    (family_medical_history IS NULL OR TRIM(family_medical_history) = '')
                );`;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).json({ error: 'Failed to fetch appointments' });
        }

        connection.query(sql1, [patient_id, date], (err, todayResult) => {
            if (err) {
                console.error('Database query error:', err);
                connection.release();
                return res.status(500).send('Failed to fetch today appointments');
            }

            connection.query(completeProfileQuery, [patient_id], (err, completeProfileResult) => {
                if (err) {
                    console.error('Database query error (profile check):', err);
                    connection.release();
                    return res.render('patients/dashboard', {
                        error: 'An error occurred while checking your profile. Please try again.',
                        firstname,
                        lastname,
                        todayAppointment: null,
                        showProfileModal: null

                    });
                }

                console.log('Profile incomplete?', completeProfileResult.length > 0);
                const showProfileModal = completeProfileResult.length > 0; // Boolean flag

                let todayAppointment = 'You have no appointment due today';
                if (todayResult.length > 0 && todayResult[0].count > 0) {
                    const doctor = todayResult[0];
                    todayAppointment = `You have ${todayResult[0].count} appointment today with ${doctor.doc_name}`;
                } else {
                    todayAppointment = 'You have no appointment due';
                }

                res.render('patients/dashboard', {
                    firstname,
                    lastname,
                    todayAppointment,
                    showProfileModal
                });

                connection.release();
            });
        });
    });
});

router.get('/patients/profile', validateTokens, (req, res) => {
    const { patient_id } = req.user;
    console.log('Patient ID from token:', patient_id); // Debug: Log the patient_id

    if (!patient_id) {
        console.error('No patient_id found in token');
        return res.status(401).render('patients/profile', {
            error: 'Authentication failed: No patient ID found. Please log in again.',
            patient: null,
            appointmentResults: []
        });
    }

    const sql = `
      SELECT 
        CONCAT(firstname, ' ', lastname) AS fullname, 
        phone, 
        email, 
        date_joined, 
        date_of_birth, 
        gender, 
        profile_img, 
        address, 
        emergency_contact_information, 
        medical_conditions, 
        allergies, 
        medications, 
        surgical_history, 
        family_medical_history
      FROM patients 
      WHERE patient_id = ?;
    `;
    const sql2 = `
      SELECT appointment_id, doctor, appointmentDate, appointmentTime, status 
      FROM appointment 
      WHERE patient_id = ?;
    `;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).render('patients/profile', {
                error: 'Failed to connect to the database.',
                patient: null,
                appointmentResults: []
            });
        }

        // Execute the first query to get patient details
        connection.query(sql, [patient_id], (err, patientResults) => {
            if (err) {
                console.error('Database query error (patient):', err);
                connection.release();
                return res.status(500).render('patients/profile', {
                    error: 'Failed to fetch your details.',
                    patient: null,
                    appointmentResults: []
                });
            }

            console.log('Patient query results:', patientResults); // Debug: Log the query results

            // Execute the second query to get appointment history
            connection.query(sql2, [patient_id], (err, appointmentResults) => {
                if (err) {
                    console.error('Database query error (appointments):', err);
                    connection.release();
                    return res.status(500).render('patients/profile', {
                        error: 'Failed to fetch your appointment history.',
                        patient: null,
                        appointmentResults: []
                    });
                }

                console.log('Appointment query results:', appointmentResults); // Debug: Log the appointment results

                // Extract the patient object (single result)
                const patient = patientResults.length > 0 ? patientResults[0] : null;

                // Render the profile page
                res.render('patients/profile', {
                    patient,
                    appointmentResults,

                });

                // Release the connection after all queries are done
                connection.release();
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
       select a.doctor, d.specialty, a.patientFullName, a.appointmentDate, a.appointmentTime, d.email,a.appointment_id, a.doctor_id, a.status from appointment a join doctors d on a.doctor_id = d.doctor_id WHERE patient_id = ? ;
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
            // console.log(results)
            res.render('patients/booked-appointment', {
                firstname,
                lastname,
                appointments: results || [],
                user: req.user,
            });
            console.log(req.user)
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

// Live Video Consultation
router.get('/consultation/live_consultation', (req, res, next) => {
    const appointmentId = req.query.appointmentId;
    const userId = req.query.userId;

    console.log(appointmentId, userId)
    if (!appointmentId || !userId) {
        res.render('ui/index');
    }

    // Check which token is present to determine user type
    const docToken = req.cookies['doc-Token'];
    const patientToken = req.cookies['access-Token'];

    if (docToken) {
        return doctorvalidateTokens(req, res, next);
    } else if (patientToken) {
        return validateTokens(req, res, next);
    } else {
        return res.status(401).render('/patients/login', {
            error: 'Please log in to continue'
        });
    }
}, (req, res) => {
    res.render('consultation/live_consultation', {
        user: req.user // Pass user data to the view if needed
    });
});

// Doctor Section
router.get('/doctor/doctordashboard', doctorvalidateTokens, (req, res) => {
    const today = new Date
    console.log(today)

    const doc_count = `SELECT COUNT(*) AS count, d.doc_name FROM appointment a JOIN doctors d ON a.doctor_id = d.doctor_id WHERE a.patient_id = ? AND a.appointmentDate = ? AND a.status = 'scheduled'`;
    const sql = 'SELECT COUNT(*) AS count FROM appointment WHERE doctor_id = ?';

    const { doc_name, doctor_id } = req.user; // Access the attached names
    console.log(doctor_id, doc_name)

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).json({ error: 'Failed to fetch appointments' });
        }

        connection.query(sql1, [patient_id, date], (err, todayResult) => {
            if (err) {
                console.error('Database query error:', err);
                connection.release();
                return res.status(500).send('Failed to fetch today appointments');
            }

            connection.query(completeProfileQuery, [patient_id], (err, completeProfileResult) => {
                if (err) {
                    console.error('Database query error (profile check):', err);
                    connection.release();
                    return res.render('patients/dashboard', {
                        error: 'An error occurred while checking your profile. Please try again.',
                        firstname,
                        lastname,
                        todayAppointment: null,
                        showProfileModal: null

                    });
                }

                console.log('Profile incomplete?', completeProfileResult.length > 0);
                const showProfileModal = completeProfileResult.length > 0; // Boolean flag

                let todayAppointment = 'You have no appointment due today';
                if (todayResult.length > 0 && todayResult[0].count > 0) {
                    const doctor = todayResult[0];
                    todayAppointment = `You have ${todayResult[0].count} appointment today with ${doctor.doc_name}`;
                } else {
                    todayAppointment = 'You have no appointment due';
                }

                res.render('patients/dashboard', {
                    firstname,
                    lastname,
                    todayAppointment,
                    showProfileModal
                });

                connection.release();
            });
        });
    });
});
// router.get('/patients/dashboard', doctorvalidateTokens, (req, res) => {
//     const date = new Date().toISOString().split('T')[0];
//     const { doc_name, doctor_id } = req.user;

//     if (!doctor_id) {
//         return res.status(401).render('doctor/doctorlogin', {
//             error: 'Authentication failed: No Doctor ID found. Please log in again.',
//             firstname,
//             lastname,
//         });
//     }

//     const sql1 = `SELECT COUNT(*) AS count, d.doc_name FROM appointment a JOIN doctors d ON a.doctor_id = d.doctor_id WHERE a.patient_id = ? AND a.appointmentDate = ? AND a.status = 'scheduled'`;
    
//     db.getConnection((err, connection) => {
//         if (err) {
//             console.error('Database connection error:', err);
//             return res.status(500).json({ error: 'Failed to fetch appointments' });
//         }

//         connection.query(sql1, [patient_id, date], (err, todayResult) => {
//             if (err) {
//                 console.error('Database query error:', err);
//                 connection.release();
//                 return res.status(500).send('Failed to fetch today appointments');
//             }

//             connection.query(completeProfileQuery, [patient_id], (err, completeProfileResult) => {
//                 if (err) {
//                     console.error('Database query error (profile check):', err);
//                     connection.release();
//                     return res.render('patients/dashboard', {
//                         error: 'An error occurred while checking your profile. Please try again.',
//                         firstname,
//                         lastname,
//                         todayAppointment: null,
//                         showProfileModal: null

//                     });
//                 }

//                 console.log('Profile incomplete?', completeProfileResult.length > 0);
//                 const showProfileModal = completeProfileResult.length > 0; // Boolean flag

//                 let todayAppointment = 'You have no appointment due today';
//                 if (todayResult.length > 0 && todayResult[0].count > 0) {
//                     const doctor = todayResult[0];
//                     todayAppointment = `You have ${todayResult[0].count} appointment today with ${doctor.doc_name}`;
//                 } else {
//                     todayAppointment = 'You have no appointment due';
//                 }

//                 res.render('patients/dashboard', {
//                     firstname,
//                     lastname,
//                     todayAppointment,
//                     showProfileModal
//                 });

//                 connection.release();
//             });
//         });
//     });
// });
router.get('/doctor/doctorsignup', (req, res) => {
    res.render('doctor/doctorsignup');
});
router.get('/doctor/doctorlogin', doctorvalidateTokens, (req, res) => {
    if (req.authenticated) {
        return res.redirect('/doctor/doctordashboard');
    }
    res.render('doctor/doctorlogin');
});
router.get('/doctor/doctorlogout', (req, res) => {
    const token = req.cookies['doc-Token'];

    if (token) {
        // Decode the token to get its expiration time
        const decoded = jwt.decode(token);
        console.log(decoded)
        const expiresAt = new Date(decoded.exp * 1000); // Convert expiration (in seconds) to Date

        // Add the token to the blacklist
        const blacklistQuery = `INSERT INTO token_blacklist (token, expires_at) VALUES (?, ?)`;
        db.query(blacklistQuery, [token, expiresAt], (err) => {
            if (err) {
                console.error('Error blacklisting token:', err);
                // Proceed with logout even if blacklisting fails
            }

            // Clear the JWT cookie
            res.clearCookie('doc-Token', {
                httpOnly: true,
                secure: process.env.NODE_ENV,
            });

            // Render the login page
            res.render('doctor/doctorlogin', {
                success: 'You have been logged out successfully.',
                redirect: false
            });
        });
    } else {
        // No token found, proceed to render login page
        res.render('doctor/doctorlogin', {
            success: 'You have been logged out successfully.',
            redirect: false
        });
    }
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
router.get('/doctor/doc_appointment', doctorvalidateTokens, (req, res) => {
    const { doc_name, doctor_id } = req.user; // Access the attached names and user_id
    const sql = `
 SELECT a.patientFullName, p.symptoms, a.appointmentDate, a.appointmentTime, a.doctor, p.email, a.appointment_id, a.patient_id, a.status FROM appointment a JOIN patients p ON a.patient_id = p.patient_id WHERE doctor_id = ?; 
    `
    db.query(sql, [doctor_id], (err, results) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch appointments');
        }
        // console.log(results)
        res.render('doctor/doc_appointment', {
            appointments: results || [],
            user: req.user,
        });
        console.log(req.user)


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
                            total_prescription,
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
router.get('/admin/admin_login', Admin_validate_Tokens, (req, res) => {
    if (req.authenticated) {
        return res.redirect('/admin/admin_dashboard');
    }
    res.render('admin/admin_login')
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
