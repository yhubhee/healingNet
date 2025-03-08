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

    // Handle text input (e.g., comma-separated symptoms)
    if (symptoms_text) {
        const textSymptoms = symptoms_text.split(',').map(s => s.trim()).filter(s => s);
        userSymptoms = userSymptoms.concat(textSymptoms);
    }

    if (userSymptoms.length === 0) {
        return res.render('symptom_checker', { error: 'Please select or enter symptoms.' });
    }

    const possibleDiseases = symptomChecker(userSymptoms);
    const symptomsString = userSymptoms.join(', ');
    pool.query('UPDATE patients SET symptoms = ? WHERE patient_id = ?', [symptomsString, patient_id], (err, result) => {
        if (err) {
            console.error('Database update error:', err);
            return res.render('symptom_results', {
                possibleDiseases,
                userSymptoms,
                firstname,
                lastname
            });
        }
        res.render('symptom_results', {
            possibleDiseases,
            userSymptoms,
            firstname,
            lastname,
        });
    });
};

exports.bookappointment = (req, res) => {
    const { illness, doctor, fullname, email, appointment_date, appointment_time } = req.body;
    const { patient_id, firstname, lastname } = req.user; // Assuming user_id is available in req.user

    if (!email || !fullname) {
        return res.render('appointment', { error: 'Please fill all required fields' });
    }

    // Check if the appointment time is within the allowed range (8 AM to 10 PM)
    const appointmentHour = parseInt(appointment_time.split(':')[0], 10);
    if (appointmentHour < 8 || appointmentHour > 22) {
        return res.render('appointment', { error: 'Appointments can only be booked between 8 AM and 10 PM' });
    }

    // Fetch doctor_id based on the selected doctor name
    const doctorName = doctor.split(' ');
    const doctorFirstName = doctorName[0];
    const doctorLastName = doctorName[1];

    const getDoctorIdQuery = 'SELECT doctor_id FROM doctors WHERE firstname = ? AND lastname = ?';
    pool.query(getDoctorIdQuery, [doctorFirstName, doctorLastName], (err, doctorResults) => {
        if (err) {
            console.log(err);
            return res.render('appointment', { error: 'Failed to fetch doctor information' });
        }

        if (doctorResults.length === 0) {
            return res.render('appointment', { error: 'Doctor not found' });
        }

        const doctor_id = doctorResults[0].doctor_id;

        // Prevent two patients from booking a doctor at the same time
        const checkAppointmentQuery = 'SELECT * FROM appointment WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?';
        pool.query(checkAppointmentQuery, [doctor_id, appointment_date, appointment_time], (err, appointmentResults) => {
            if (err) {
                console.log(err);
                return res.render('appointment', { error: 'Failed to check existing appointments' });
            }

            if (appointmentResults.length > 0) {
                return res.render('appointment', { error: 'The doctor already has an appointment at the specified time. Please choose a different time IN 2 HRS.' });
            }

            const appointmentData = {
                illness,
                doctor,
                fullname,
                email,
                appointment_date,
                appointment_time,
                patient_id,
                doctor_id,
                status: 'Scheduled'
            };
            const sql = 'SELECT COUNT(*) AS count FROM appointment WHERE patient_id = ? AND status = "Scheduled"';
            pool.query('INSERT INTO appointment SET ?', appointmentData, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.render('appointment', { error: 'Failed to book appointment' });
                }
                pool.query(sql, [patient_id], (err, results) => {
                    if (err) {
                        console.log(err)
                    }
                    const appointmentsNumber = results[0].count;
                    res.render('appointment', {
                        success: 'Appointment successfully booked ✅ The meeting link will be sent to your email',
                        redirect: true,
                        firstname,
                        lastname,
                        appointmentsNumber
                    });
                });
            });
        });
    });
};
