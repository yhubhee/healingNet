const express = require('express');
const router = express.Router();
const register = require('../controllers/register');
const bookappointment = require('../controllers/bookappointment');
const login = require('../controllers/login');
const forgot_pass = require('../controllers/forgot_pass');
const doclogin = require('../controllers/doctorlogin');
const { validateTokens } = require('../middlewares/auth');
const {validatePasswordResetToken} = require('../middlewares/auth');
const { validateDoctor_reset_secret } = require('../middlewares/authdoctor');
const mail = require('../controllers/mail');
const edit_profile = require('../controllers/edit_profile');
const admin_login = require('../controllers/admin_login');
const admin_register = require('../controllers/admin_register');
const liveShareController = require('../controllers/live_share');
const authUniversal = require('../middlewares/authUniversal');

// Patients auth/register
router.post('/signup', register.register);
router.post('/login', login.login);

// Patient's Password reset
router.post('/password_reset', forgot_pass.forgot_pass);
router.post('/reset_pass', validatePasswordResetToken, forgot_pass.reset_pass);

//Update Patients details
router.post('/edit_profile', validateTokens, edit_profile.edit_profile) 

// Symptoms Checker route
router.post('/symptom_checker', validateTokens, bookappointment.symptom_checker);

// Appointment booking route
router.post('/submit_appointment', validateTokens, bookappointment.bookappointment);

// Doctor Register
router.post('/doctorregister', register.doctorregister);
router.post('/doctorlogin', doclogin.doctorlogin);

// Send Mail
router.post('/sendmail', mail.sendmail) 

// Doctor's Password reset
router.post('/Doc_password_Reset', forgot_pass.Doc_forgot_pass);
router.post('/Doc_reset_pass', validateDoctor_reset_secret, forgot_pass.Doc_reset_pass);

// Admin Auth route
router.post('/admin_signup', admin_register.admin_register);
router.post('/admin_login', admin_login.admin_login);

//  Live share post 
router.post('/live_share', authUniversal, liveShareController.live_share);

module.exports = router;

