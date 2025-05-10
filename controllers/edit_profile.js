const db = require('../database');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Export the route handler
exports.edit_profile = [
    upload.single('profileImage'), // Handle single file upload for profileImage
    async (req, res) => {
        const { patient_id } = req.user;
        const {
            fullname,
            date_of_birth,
            gender,
            phone,
            address,
            emergency_contact_information,
            medical_conditions,
            allergies,
            medications,
            surgical_history,
            family_medical_history,
            password
        } = req.body;

        // Handle file upload
        const profileImage = req.file ? req.file.filename : null;

        // Split fullname into firstname and lastname
        const nameParts = fullname ? fullname.trim().split(' ') : ['Unknown', 'User'];
        const firstname = nameParts[0];
        const lastname = nameParts.slice(1).join(' ') || 'User';

        // Map all fields to their database column names
        const fieldsToUpdate = {
            firstname,
            lastname,
            date_of_birth,
            gender,
            phone,
            address,
            emergency_contact_information,
            medical_conditions,
            allergies,
            medications,
            surgical_history,
            family_medical_history,
            profile_img: profileImage
        };

        // If password is provided, hash it and add to fields
        if (password) {
            fieldsToUpdate.password = await bcrypt.hash(password, 10);
        }

        // Filter out fields with null/undefined/empty values and build the query
        const updateFields = [];
        const updateValues = [];
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            if (value !== null && value !== undefined && value !== '') {
                updateFields.push(`${key} = ?`);
                updateValues.push(value);
            }
        }

        // Add patient_id for the WHERE clause
        updateValues.push(patient_id);

        if (updateFields.length === 0) {
            return res.render('patients/profile', {
                error: 'No fields to update.',
                patient: null,
                appointmentResults: []
            });
        }

        const updateQuery = `
            UPDATE patients 
            SET ${updateFields.join(', ')}
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

            // Update the patient profile
            connection.query(updateQuery, updateValues, (err, updateResult) => {
                if (err) {
                    console.error('Database update error:', err);
                    connection.release();
                    return res.status(500).render('patients/profile', {
                        error: 'Something went wrong. Please try again later.',
                        patient: null,
                        appointmentResults: []
                    });
                }

                // Fetch the updated patient data and date
                const date = new Date().toISOString().split('T')[0];
                const fetchQuery = `
                    SELECT COUNT(*) AS count, d.doc_name FROM appointment a JOIN doctors d ON a.doctor_id = d.doctor_id WHERE a.patient_id = ? AND a.appointmentDate = ?;
                `;
                const fetchAppointmentsQuery = `
                    SELECT appointment_id, doctor, appointmentDate, appointmentTime, status 
                    FROM appointment 
                    WHERE patient_id = ?;
                `;

                connection.query(fetchQuery, [patient_id, date], (err, patientResults) => {
                    if (err) {
                        console.error('Database fetch error (patient):', err);
                        connection.release();
                        return res.status(500).render('patients/profile', {
                            error: 'Error retrieving updated profile data.',
                            patient: null,
                            appointmentResults: []
                        });
                    }

                    // Fetch appointment history
                    connection.query(fetchAppointmentsQuery, [patient_id], (err, appointmentResults) => {
                        if (err) {
                            console.error('Database fetch error (appointments):', err);
                            connection.release();
                            return res.status(500).render('patients/profile', {
                                error: 'Error retrieving appointment history.',
                                patient: null,
                                appointmentResults: []
                            });
                        }

                        const patient = patientResults.length > 0 ? patientResults[0] : null;

                        res.render('patients/profile', {
                            success: 'Profile successfully updated.',
                            redirect: true,
                            patient,
                            appointmentResults
                        });

                        connection.release();
                    });
                });
            });
        });
    }
];