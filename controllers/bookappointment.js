const pool = require('../database');

exports.symptom_checker = (req, res) => {
    const { symptoms_list, symptoms_text } = req.body;
    const userSymptoms = [];

    // Handle dropdown selections (works with Select2)
    if (symptoms_list) {
        if (Array.isArray(symptoms_list)) {
            userSymptoms.push(...symptoms_list);
        } else {
            userSymptoms.push(symptoms_list);
        }
    }

    // Handle text input
    if (symptoms_text) {
        const textSymptoms = symptoms_text.split(',').map(s => s.trim()).filter(s => s);
        userSymptoms.push(...textSymptoms);
    }

    // Validate input
    if (userSymptoms.length === 0) {
        const allSymptoms = new Set();
        Object.keys(symptoms).forEach(department => {
            const departmentData = symptoms[department];
            Object.keys(departmentData).forEach(diseaseOrCategory => {
                const data = departmentData[diseaseOrCategory];
                if (data.common && data.less_common) {
                    if (Array.isArray(data.common)) {
                        data.common.forEach(symptom => allSymptoms.add(symptom));
                    }
                    if (Array.isArray(data.less_common)) {
                        data.less_common.forEach(symptom => allSymptoms.add(symptom));
                    }
                } else {
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

        return res.render('symptom_checker', {
            firstname: req.user.firstname || 'User',
            lastname: req.user.lastname || '',
            symptomList: symptomList,
            error: 'Please select or enter at least one symptom.'
        });
    }

    // Process symptoms (your symptomChecker logic here)
    const possibleDiseases = symptomChecker(userSymptoms);

    res.render('symptom_results', {
        firstname: req.user.firstname || 'User',
        lastname: req.user.lastname || '',
        userSymptoms: userSymptoms,
        possibleDiseases: possibleDiseases
    });
}

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


