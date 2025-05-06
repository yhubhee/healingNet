const pool = require('../database');
const {symptomChecker} = require('../controllers/symptomChecker');

exports.symptom_checker = (req, res) => {
    const { firstname, lastname} = req.user; 
    const { symptoms_list, symptoms_text } = req.body;
    let userSymptoms = [];

    // Handle dropdown or multi-select input
    if (symptoms_list) {
        userSymptoms = Array.isArray(symptoms_list) ? symptoms_list : [symptoms_list];
    }

    // Handle text input (e.g., comma-separated symptoms)
    if (symptoms_text) {
        const textSymptoms = symptoms_text.split(',').map(s => s.trim()).filter(s => s);
        userSymptoms = userSymptoms.concat(textSymptoms);
    }

    if (userSymptoms.length === 0) {
        return res.render('symptom_checker', { error: 'Please select or enter symptoms.' });
    }

    const possibleDiseases = symptomChecker(userSymptoms);
    res.render('symptom_results', { 
        possibleDiseases,
        userSymptoms,
        firstname,
        lastname,
     });
};

exports.bookappointment = (req, res) => {
    const { appointmentTime, appointmentDate, doctor, specialty } = req.body;
    const { patient_id } = req.user; // Assuming user_id is available in req.user

    if (!appointmentTime || !appointmentDate) {
        return res.render('ui/book_appointment', { 
            error: 'Please fill all required fields', 
            doctor, // Pass doctor to the view
            specialty // Pass specialty to the view
        });
    }

    // Check if the appointment time is within the allowed range (8 AM to 10 PM)
    const appointmentHour = parseInt(appointmentTime.split(':')[0], 10);
    if (appointmentHour < 8 || appointmentHour > 22) {
        return res.render('ui/book_appointment', { 
            error: 'Appointments can only be booked between 8 AM and 10 PM', 
            doctor, // Pass doctor to the view
            specialty // Pass specialty to the view
        });
    }

    // Fetch doctor_id based on the selected doctor name
    const getDoctorIdQuery = 'SELECT doctor_id FROM doctors WHERE doc_name = ?';
    pool.query(getDoctorIdQuery, [doctor], (err, doctorResults) => {
        if (err) {
            console.log(err);
            return res.render('ui/book_appointment', { 
                error: 'Failed to fetch doctor information', 
                doctor, 
                specialty 
            });
        }

        if (doctorResults.length === 0) {
            return res.render('ui/book_appointment', { 
                error: 'Doctor not found', 
                doctor, // Pass doctor to the view
                specialty // Pass specialty to the view
            });
        }

        const doctor_id = doctorResults[0].doctor_id;

        // Prevent two patients from booking a doctor at the same time
        const checkAppointmentQuery = 'SELECT * FROM appointment WHERE doctor_id = ? AND appointmentDate = ? AND appointmentDate = ?';
        pool.query(checkAppointmentQuery, [doctor_id, appointmentDate, appointmentTime], (err, appointmentResults) => {
            if (err) {
                console.log(err);
                return res.render('ui/book_appointment', { 
                    error: 'Failed to check existing appointments', 
                    doctor, // Pass doctor to the view
                    specialty // Pass specialty to the view
                });
            }

            if (appointmentResults.length > 0) {
                return res.render('ui/book_appointment', { 
                    error: 'The doctor already has an appointment at the specified time. Please choose a different time IN 2 HRS.', 
                    doctor, // Pass doctor to the view
                    specialty // Pass specialty to the view
                });
            }

            const appointmentData = {
                doctor,
                specialty,
                appointmentDate,
                appointmentTime,
                patient_id,
                doctor_id,
                status: 'Scheduled'
            };

            pool.query('INSERT INTO appointment SET ?', appointmentData, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.render('ui/book_appointment', { 
                        error: 'Failed to book appointment', 
                        doctor, // Pass doctor to the view
                        specialty // Pass specialty to the view
                    });
                } else {
                    const firstname = req.user ? req.user.firstname : 'User';
                    const lastname = req.user ? req.user.lastname : '';

                    // Query to count today's appointments for the user
                    const countAppointmentsQuery = `
                        SELECT COUNT(*) AS appointmentsNumber 
                        FROM appointment 
                        WHERE patient_id = ? AND appointmentDate = CURDATE()
                    `;
                    pool.query(countAppointmentsQuery, [patient_id], (err, countResults) => {
                        if (err) {
                            console.log(err);
                            return res.render('patients/dashboard', {
                                success: 'Appointment successfully booked ✅ The meeting link will be sent to your email',
                                redirect: true,
                                firstname,
                                lastname,
                                appointmentsNumber: 0 // Default to 0 if query fails
                            });
                        }

                        const appointmentsNumber = countResults[0].appointmentsNumber;
                        res.render('patients/dashboard', {
                            success: 'Appointment successfully booked ✅ The meeting link will be sent to your email',
                            redirect: true,
                            firstname,
                            lastname,
                            appointmentsNumber // Pass the count to the view
                        });
                    });
                }
            });
        });
    });
};

