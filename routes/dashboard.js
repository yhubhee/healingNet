const express = require('express');
const router = express.Router();
const db = require('../database');
const { validateTokens } = require('../middlewares/auth');

router.get('/dashboard', validateTokens, (req, res) => {
    const userId = req.user.id;

    db.query('SELECT firstname, lastname FROM patients WHERE patient_id = ?', [userId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }

        if (result.length > 0) {
            const patient = result[0];
            res.render('dashboard', {
                firstname: patient.firstname,
                lastname: patient.lastname
            });
        } else {
            res.status(404).send('Patient not found');
        }
    });
});

module.exports = router;