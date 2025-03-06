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
    const { department, specialty, doctor, fullname, email, illness, appointment_date, appointment_time } = req.body;
    const { patient_id } = req.user; // Assuming user_id is available in req.user

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
                department,
                specialty,
                doctor,
                fullname,
                email,
                illness,
                appointment_date,
                appointment_time,
                patient_id,
                doctor_id,
                status: 'Scheduled'
            };

            pool.query('INSERT INTO appointment SET ?', appointmentData, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.render('appointment', { error: 'Failed to book appointment' });
                } else {
                    const firstname = req.user ? req.user.firstname : 'User';
                    const lastname = req.user ? req.user.lastname : '';
                    res.render('dashboard', {
                        success: 'Appointment successfully booked ✅ The meeting link will be sent to your email',
                        redirect: true,
                        firstname,
                        lastname
                    });
                }
            });
        });
    });
};


// const symptom = {
//     "Primary Care": {
//         "Hypertension": {
//             common: [
//                 "Often asymptomatic (known as the 'silent killer')",
//                 "Headaches (especially morning headaches)",
//                 "Dizziness",
//                 "Blurred vision"
//             ],
//             less_common: [
//                 "Nosebleeds (rare)",
//                 "Shortness of breath",
//                 "Chest pain",
//                 "Anxiety or nervousness"
//             ],
//             telemedicine_context: "Patients can report symptoms like headaches or dizziness via virtual consultation. Blood pressure monitoring devices (if available) can be used at home, with results shared remotely."
//         }
//     }
// }
// Object.keys
// console.log(symptom.forEach(department => {
    
// }));