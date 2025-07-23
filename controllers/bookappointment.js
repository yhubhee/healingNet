const pool = require('../database');
const { symptomChecker } = require('../controllers/symptomChecker');

exports.symptom_checker = (req, res) => {
    const { firstname, lastname, patient_id } = req.user;
    const { symptoms_list, symptoms_text } = req.body;
    let userSymptoms = [];

    // Handle dropdown or multi-select input
    if (symptoms_list) {
        userSymptoms = Array.isArray(symptoms_list) ? symptoms_list : [symptoms_list];
    }

    // Handle text input (comma-separated symptoms)
    if (symptoms_text) {
        const textSymptoms = symptoms_text.split(',').map(s => s.trim()).filter(s => s);
        userSymptoms = userSymptoms.concat(textSymptoms);
    }

    // Validate symptoms
    if (userSymptoms.length === 0) {
        return res.render('ui/symptom_checker', {
            error: 'Please select or enter symptoms.',
            firstname,
            lastname
        });
    }

    // Process symptoms to get possible diseases
    const possibleDiseases = symptomChecker(userSymptoms);

    // Combine symptoms into a single string for storage
    const symptomsString = userSymptoms.join(', ');

    // Update the patients table
    pool.query(
        'UPDATE patients SET symptoms = ? WHERE patient_id = ?',
        [symptomsString, patient_id],
        (err, result) => {
            if (err) {
                console.error('Database update error:', err);
                return res.render('ui/symptom_results', {
                    error: 'Failed to save symptoms. Please try again.',
                    possibleDiseases,
                    userSymptoms,
                    firstname,
                    lastname
                });
            }

            res.render('ui/symptom_results', {
                possibleDiseases,
                userSymptoms,
                firstname,
                lastname,
                success: 'Symptoms saved successfully'
            });
        }
    );
};

exports.bookappointment = (req, res) => {
    const { appointmentTime, appointmentDate, doctor, specialty } = req.body;
    const { patient_id, firstname, lastname } = req.user;

    // Validate required fields
    if (!appointmentTime || !appointmentDate || !doctor || !specialty) {
        return res.render('ui/book_appointment', {
            error: 'Please fill all required fields',
            doctor,
            specialty
        });
    }

    // Check if the appointment time is within the allowed range (8 AM to 10 PM)
    const appointmentHour = parseInt(appointmentTime.split(':')[0], 10);
    if (appointmentHour < 5 || appointmentHour > 23) {
        return res.render('ui/book_appointment', {
            error: 'Appointments can only be booked between 5 AM and 11 PM',
            doctor,
            specialty
        });
    }

    // Parse appointment date and time into a single Date object
    const selectedDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
    // console.log('Selected DateTime:', selectedDateTime);
    if (isNaN(selectedDateTime.getTime())) {
        return res.render('ui/book_appointment', {
            error: 'Invalid date or time format. Please use YYYY-MM-DD for date and HH:mm for time.',
            doctor,
            specialty
        });
    }

    // Get current date and time
    const now = new Date();

    // Check if the selected date and time is in the past or current time
    if (selectedDateTime <= now) {
        return res.render('ui/book_appointment', {
            error: 'Cannot book an appointment in the past or at the current time',
            doctor,
            specialty
        });
    }

    // Check if the appointment date is more than 30 days in the future
    const thirtyDaysFromNow = new Date(now);
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    if (selectedDateTime > thirtyDaysFromNow) {
        return res.render('ui/book_appointment', {
            error: 'Cannot book an appointment more than 30 days in advance',
            doctor,
            specialty
        });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.render('ui/book_appointment', {
                error: 'An error occurred while connecting to the database.',
                doctor,
                specialty
            });
        }

        // Fetch doctor_id based on the selected doctor name
        const getDoctorIdQuery = 'SELECT doctor_id FROM doctors WHERE doc_name = ?';
        connection.query(getDoctorIdQuery, [doctor], (err, doctorResults) => {
            if (err) {
                console.error('Database query error (doctor fetch):', err);
                connection.release();
                return res.render('ui/book_appointment', {
                    error: 'Failed to fetch doctor information',
                    doctor,
                    specialty
                });
            }

            if (doctorResults.length === 0) {
                connection.release();
                return res.render('ui/book_appointment', {
                    error: 'Doctor not found',
                    doctor,
                    specialty
                });
            }

            const doctor_id = doctorResults[0].doctor_id;

            // Check for complete profile
            const completeProfileQuery = `
                SELECT * FROM patients 
                WHERE patient_id = ? AND (
                    (address IS NULL OR TRIM(address) = '') OR 
                    (emergency_contact_information IS NULL OR TRIM(emergency_contact_information) = '') OR 
                    (medical_conditions IS NULL OR TRIM(medical_conditions) = '') OR 
                    (allergies IS NULL OR TRIM(allergies) = '') OR 
                    (medications IS NULL OR TRIM(medications) = '') OR 
                    (surgical_history IS NULL OR TRIM(surgical_history) = '') OR 
                    (family_medical_history IS NULL OR TRIM(family_medical_history) = '')
                );
            `;
            connection.query(completeProfileQuery, [patient_id], (err, completeProfileResult) => {
                if (err) {
                    console.error('Database query error (profile check):', err);
                    connection.release();
                    return res.render('ui/book_appointment', {
                        error: 'An error occurred while checking your profile. Please try again.',
                        doctor,
                        specialty
                    });
                }

                console.log('Profile check result:', completeProfileResult);
                console.log('Profile incomplete?', completeProfileResult.length > 0);

                // If profile is incomplete (result length > 0 means at least one field is empty or null)
                if (completeProfileResult.length > 0) {
                    connection.release();
                    return res.render('ui/book_appointment', {
                        error: 'Please complete your profile to book an appointment.',
                        doctor,
                        specialty
                    });
                }

                // Check if the selected time slot is already booked for the doctor
                const checkAvailabilityQuery = `
                    SELECT * FROM appointment 
                    WHERE doctor = ? AND appointmentDate = ? AND appointmentTime = ? AND status = 'scheduled';
                `;
                connection.query(checkAvailabilityQuery, [doctor, appointmentDate, appointmentTime], (err, existingAppointments) => {
                    if (err) {
                        console.error('Database query error (availability check):', err);
                        connection.release();
                        return res.render('ui/book_appointment', {
                            error: 'Failed to check appointment availability.',
                            doctor,
                            specialty
                        });
                    }

                    if (existingAppointments.length > 0) {
                        connection.release();
                        return res.render('ui/book_appointment', {
                            error: 'This time slot is already booked for the selected doctor.',
                            doctor,
                            specialty
                        });
                    }

                    // Profile is complete and time slot is available, proceed with booking
                    const fullName = `${firstname} ${lastname}`;
                    const appointmentData = {
                        doctor,
                        specialty,
                        appointmentDate,
                        appointmentTime,
                        patient_id,
                        doctor_id,
                        fullName,
                        status: 'scheduled'
                    };

                    connection.query('INSERT INTO appointment SET ?', appointmentData, (err, result) => {
                        if (err) {
                            console.error('Database insertion error:', err);
                            connection.release();
                            return res.render('ui/book_appointment', {
                                error: 'Failed to book appointment',
                                doctor,
                                specialty
                            });
                        }
                        const insertedId = result.insertId;
                        console.log('Inserted appointment ID:', insertedId);

                        // Query to count today's appointments for the user
                        const countAppointmentsQuery = `
                            SELECT COUNT(*) AS appointmentsNumber 
                            FROM appointment 
                            WHERE patient_id = ? AND appointmentDate = CURDATE();
                        `;
                        connection.query(countAppointmentsQuery, [patient_id], (err, countResults) => {
                            if (err) {
                                console.error('Database query error (appointment count):', err);
                                connection.release();
                                return res.render('ui/book_appointment', {
                                    error: 'Appointment booked, but failed to fetch appointment count.',
                                    doctor,
                                    specialty
                                });
                            }

                            const appointmentsNumber = countResults[0].appointmentsNumber || 0;

                            // Fetch the list of doctors
                            const fetchDoctorsQuery = 'SELECT * FROM doctors';
                            connection.query(fetchDoctorsQuery, (err, fetchedDoctors) => {
                                connection.release();
                                if (err) {
                                    console.error('Database query error (fetch doctors):', err);
                                    return res.render('ui/book_appointment', {
                                        error: 'Failed to fetch doctors list',
                                        doctor,
                                        specialty
                                    });
                                }

                                res.render('ui/book_appointment', {
                                    success: 'Appointment successfully booked ✅',
                                    redirect: true,
                                    firstname: firstname || 'User',
                                    lastname: lastname || '',
                                    appointmentsNumber,
                                    doctor,
                                    specialty,
                                    doctors: fetchedDoctors
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

