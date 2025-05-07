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

        const appointmentData = {
            doctor,
            specialty,
            appointmentDate,
            appointmentTime,
            patient_id,
            doctor_id,
            status: 'scheduled'
        };

        pool.query('INSERT INTO appointment SET ?', appointmentData, (err, result) => {
            if (err) {
                console.log(err);
                return res.render('ui/book_appointment', {
                    error: 'Failed to book appointment',
                    doctor, // Ensure doctor is passed
                    specialty // Ensure specialty is passed
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
                    let appointmentsNumber = 0; // Default value
                    let message = 'Appointment successfully booked ✅ ';

                    if (err) {
                        console.log('Error fetching appointment count:', err);
                        message = 'Failed to fetch appointment count. Your appointment was booked, but please check your dashboard later.';
                    } else {
                        appointmentsNumber = countResults[0].appointmentsNumber || 'no';
                    }

                    res.render('ui/book_appointment', {
                        success: message,
                        redirect: true,
                        firstname,
                        lastname,
                        appointmentsNumber,
                        doctor, // Ensure doctor is passed
                        specialty // Ensure specialty is passed
                    });
                });
            }
        });
    });
};

