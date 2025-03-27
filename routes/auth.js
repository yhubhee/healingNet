const express = require('express');
const pool = require('../database');
const router = express.Router();
const register = require('../controllers/register');
const bookappointment = require('../controllers/bookappointment');
const login = require('../controllers/login');
const forgot_pass = require('../controllers/forgot_pass');
const doclogin = require('../controllers/doctorlogin');
const { validateTokens } = require('../middlewares/auth');
const { doctorvalidateTokens } = require('../middlewares/authdoctor');
const {validatePasswordResetToken} = require('../middlewares/auth');
const { validateDoctor_reset_secret } = require('../middlewares/authdoctor');
const mail = require('../controllers/mail');
const edit_profile = require('../controllers/edit_profile');


// 'auth/register
router.post('/signup', register.register);
router.post('/login', login.login);

// Patient's Password reset
router.post('/password_reset', forgot_pass.forgot_pass);
router.post('/reset_pass', validatePasswordResetToken, forgot_pass.reset_pass);

//Update Patients details
router.post('/edit_profile',validateTokens, edit_profile.edit_profile);

// Appointment booking route
router.post('/symptom_checker', validateTokens, bookappointment.symptom_checker);
router.post('/appointment', validateTokens, bookappointment.bookappointment);

router.post('/cancel-appointment', (req, res) => {
    const { appointment_id } = req.body;
    const query = 'UPDATE appointment SET status = "Cancelled" WHERE appointment_id = ?';

    pool.query(query, [appointment_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }
        res.redirect('/booked-appointment');
    });
});


// Doctor Auth
router.post('/doctorregister', register.doctorregister);
router.post('/doctorlogin', doclogin.doctorlogin);

// Send Mail From Contact Page
router.post('/sendmail', mail.sendmail) 

// Doctor's Password reset
router.post('/Doc_password_Reset', forgot_pass.Doc_forgot_pass);
router.post('/Doc_reset_pass', validateDoctor_reset_secret, forgot_pass.Doc_reset_pass);

// send Prescription
router.post('/createprescription', doctorvalidateTokens, (req, res) => {
    const { doctor_id } = req.user;
    const { patient_id, medication, date_prescribed, start_date, end_date, dosage, instructions, frequency, status } = req.body;

    const data = {patient_id, doctor_id, medication, date_prescribed, start_date, end_date, dosage, instructions, frequency, status}

    const sql1 = `
        SELECT a.medication, a.dosage, a.frequency, a.instructions, a.date_prescribed, a.start_date, a.end_date, a.prescriptions_id, a.status, p.symptoms, CONCAT(p.firstname, ' ', p.lastname) AS fullname, p.patient_id FROM patients p JOIN prescriptions a ON p.patient_id = a.patient_id WHERE a.doctor_id = ?`;

    const sql2 = `
        SELECT CONCAT(p.firstname, ' ', p.lastname) AS fullname, p.patient_id, p.symptoms FROM patients p JOIN appointment a ON p.patient_id = a.patient_id JOIN doctors d ON a.doctor_id = d.doctor_id WHERE d.doctor_id = ? AND a.status = "Scheduled"`;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Failed to fetch Prescription');
        }

        connection.query('INSERT INTO prescriptions SET ?', data, (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                connection.release();
                return res.render('doc_prescription',{
                    error: 'Failed to add prescription'
                });
            }
            connection.query(sql1, [doctor_id], (err, prescriptions) => {
                if (err) {
                    console.error('Database query error for prescriptions:', err);
                    connection.release();
                    return res.status(500).send('Failed to fetch Prescription');
                }
    
                // Execute the second query (patients)
                connection.query(sql2, [doctor_id], (err, patients) => {
                    connection.release(); // Release connection after both queries
                    if (err) {
                        console.error('Database query error for patients:', err);
                        return res.status(500).send('Failed to fetch Prescription');
                    }
    
                    // Render the template with separate data
                    res.render('doc_prescription', {
                        success: "Prescription added successfully",
                        doc_prescription: prescriptions || [],
                        patients: patients || [],
                    });
                });
            });

        });
        
    });

    // pool.getConnection((err, connection) => {
    //     connection.query('INSERT INTO prescriptions SET ?', data, (err, result) => {
    //         if (err) {
    //             console.error('Database query error:', err);
    //             connection.release();
    //             return res.render('doc_prescription',{
    //                 error: 'Failed to add prescription'
    //             });
    //         }

    //         connection.query(sql1, [doctor_id], (err, prescriptions) => {
    //             if (err) {
    //                 console.error('Database query error for prescriptions:', err);
    //                 connection.release();
    //                 return res.render('doc_prescription',{
    //                     error: "Failed to fetch Prescription"
    //                 });
    //             }
    //         });
    //         res.render('doc_prescription', {
    //             doc_prescription: prescriptions || [],
    //             success: "Prescription added successfully"
    //         });

    //     });
    // });
   
});
// Delete Prescription
router.post('/delete_prescription', doctorvalidateTokens,(req,res) =>{
    const {prescriptions_id} = req.body
    const query = 'UPDATE  prescriptions SET status = "Cancelled" WHERE prescriptions_id = ?';

    pool.query(query, [prescriptions_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }
        res.redirect('/doc_prescription');
    });

});

module.exports = router;

