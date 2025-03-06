const db = require('../database');


exports.edit_profile = (req, res) => {
    // if (!req.user) {
    //     return res.render('login', {
    //         error: 'User not authenticated',
    //     });
    // }

    const { patient_id, firstname, lastname } = req.user;
    const { medical_history, medical_record_upload, emergency_contact, marital_status, chronic_conditions, next_of_kin } = req.body;

    db.query(`UPDATE patients SET medical_history = ?, medical_record_upload = ?, emergency_contact = ?, marital_status = ?, chronic_conditions = ?, next_of_kin = ? WHERE patient_id = ?`,
        [medical_history, medical_record_upload, emergency_contact, marital_status, chronic_conditions, next_of_kin, patient_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.render('dashboard', {
                error: 'Something went wrong. Please try again later.',
            });
        } else {
            res.render('dashboard', {
                success: `Profile successfully updated for Dear ${firstname} ${lastname}`,
            });
        }
    });
};