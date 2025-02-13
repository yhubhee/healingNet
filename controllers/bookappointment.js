const { name } = require('ejs');
const pool = require('../database');

exports.bookappointment = (req, res) => {
    const { department, specialty, doctor, fullname, email, illness, appointment_date, appointment_time } = req.body;
    const { user_id } = req.user; // Assuming user_id is available in req.user

    if (!email || !fullname) {
        return res.render('appointment', { error: 'Please fill all required fields' });
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

        const appointmentData = {
            department,
            specialty,
            doctor,
            fullname,
            email,
            illness,
            appointment_date,
            appointment_time,
            patient_id: user_id,
            doctor_id,
            status: 'Scheduled'
        };

        pool.query('INSERT INTO appointment SET ?', appointmentData, (err, result) => {
            if (err) {
                console.log(err);
                return res.render('appointment', { error: 'Failed to book appointment' });
            } else {
                res.render('dashboard', {
                    message: 'Appointment successfully booked ✅ The meeting link will be sent to your email',
                    redirect: true
                });
            }
        });
    });
};

