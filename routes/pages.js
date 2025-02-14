const express = require('express');
const router = express.Router();
const db = require('../database');
const { validateTokens } = require('../middlewares/auth');
const { doctorvalidateTokens } = require('../middlewares/authdoctor');
const { bookappointment } = require('../controllers/bookappointment')

router.get('/about', (req, res) => {
    res.render('about');
});
router.get('/service', (req, res) => {
    res.render('service');
});
router.get('/service-details', (req, res) => {
    res.render('service-details');
});
router.get('/price', (req, res) => {
    res.render('price');
});
router.get('/testimonial', (req, res) => {
    res.render('testimonial');
});
router.get('/contact', (req, res) => {
    res.render('contact');
});
router.get('/blog', (req, res) => {
    res.render('blog');
});
router.get('/detail',(req, res)=>{
    res.render('detail');
});
router.get('/team',(req, res)=>{
    res.render('team');
});
router.get('/search',(req, res)=>{
    res.render('search');
});
router.get('/appointment',(req, res)=>{
    res.render('appointment');
});
// Appointment post
router.post('/auth/appointment', validateTokens, bookappointment);

router.get('/booked-appointment', validateTokens, (req, res) => {
    const { firstname, lastname, user_id } = req.user; // Access the attached names and user_id
    const sql = `
        SELECT a.doctor, a.specialty, a.appointment_date, a.appointment_time, a.status
        FROM appointment a
        WHERE a.patient_id = ?
    `;
    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err); // Debugging log
            return res.status(500).send('Failed to fetch appointments');
        }
        res.render('booked-appointment', {
            firstname,
            lastname,
            appointments: results || []
        });
    });
});
router.get('/logout', (req, res)=>{
    res.render('login')
})
router.get('/features', (req, res) => {
    res.render('features');
});
router.get('/signup', (req, res) => {
    res.render('signup');
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/create-appointment', (req, res) => {
    res.render('create-appointment');
});

router.get('/dashboard', validateTokens, (req, res) => {
    const { firstname, lastname } = req.user; // Access the attached names
    res.render('dashboard', {
        firstname,
        lastname
    });
});

// Route to handle AJAX request for doctors
router.get('/getDoctors', (req, res) => {
    // Extract the 'specialty' query parameter from the request URL
    const specialty = req.query.specialty;

      console.log('Specialty:', specialty); // Debugging log

    const sql = 'SELECT doctor_id, firstname, lastname FROM doctors WHERE specialty = ?';
    db.query(sql, [specialty], (err, results) => {
        if (err) {
            console.error('Database query error:', err); // Debugging log
            return res.status(500).json({ error: 'Failed to fetch doctors' });
        }
        console.log('Query Results:', results); // Debugging log
        res.json({ doctors: results });
    });
});


// Doctor Section
router.get('/doctorsignup', (req, res) => {
    res.render('doctorsignup');
});
router.get('/doctorlogin', (req, res) => {
    res.render('doctorlogin');
});
router.get('/doctordashboard', doctorvalidateTokens, (req, res) => {
    const { doctor_id, firstname, lastname } = req.user; // Access the attached doctor_id and names
    const sql = `
      SELECT a.appointment_date, a.appointment_time, a.status, p.firstname AS patient_name, p.email
        FROM appointment a
        JOIN patients p ON a.patient_id = p.patient_id
        WHERE a.doctor_id = ?
        
    `;
    db.query(sql, [doctor_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err); // Debugging log
            // return res.status(500).json({ error: 'Failed to fetch appointments' });
        }
        res.render('doctordashboard', {
            firstname,
            lastname,
            appointments: results  || [] 
        });
    });
});

module.exports = router;

