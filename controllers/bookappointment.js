const pool = require('../database');

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


// // Example controller function
// exports.getProfile = (req, res) => {
//     const { patient_id } = req.user;
//     const query = 'SELECT firstname, lastname, email, phone, address, date_joined, date_of_birth, gender FROM patients WHERE patient_id = ?';
//     pool.query(query, [patient_id], (err, results) => {
//         if (err) {
//             console.log(err);
//             return res.render('profile', { error: 'Failed to fetch patient data' });
//         }
//         res.render('profile', { patient: results });
//     });
// };