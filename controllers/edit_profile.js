const db = require('../database');

exports.edit_profile = (req, res) => {
    const { patient_id} = req.user;
    const { medical_history, medical_record_upload, emergency_contact, marital_status, chronic_conditions, next_of_kin } = req.body;

    db.query(`UPDATE patients SET medical_history = ?, medical_record_upload = ?, emergency_contact = ?, marital_status = ?, chronic_conditions = ?, next_of_kin = ? WHERE patient_id = ?`,
        [medical_history, medical_record_upload, emergency_contact, marital_status, chronic_conditions, next_of_kin, patient_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.render('profile', {
                error: 'Something went wrong. Please try again later.',
            });
        }
        db.query(`select firstname, lastname, phone, email, date_joined, date_of_birth, gender, address, medical_history, medical_record_upload, emergency_contact, marital_status, chronic_conditions, next_of_kin from patients WHERE patient_id = ? ;`, [patient_id], (err, result) => {
            if (err) {
                console.log(err);
                return res.render('profile', {
                    error: 'Error retrieving updated profile data.',
                    result: []
                });
            }
            res.render('profile', {
                success: `Profile successfully updated.`,
                patient: result 
            });
        }); 
        
    });
};

