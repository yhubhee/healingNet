const express = require('express');
const router = express.Router();
const register = require('../controllers/register')
const bookappointment = require('../controllers/bookappointment')
const login = require('../controllers/login')
const doclogin = require('../controllers/doctorlogin')
const { validateTokens } = require('../middlewares/auth');
const { doctorvalidateTokens } = require('../middlewares/authdoctor')

// 'auth/register
router.post('/signup', register.register)
router.post('/login', login.login)

// 
router.post('/appointment', validateTokens, bookappointment.bookappointment)

//Doctor Auth
router.post('/doctorregister', register.doctorregister)
router.post('/doctorlogin', doclogin.doctorlogin)

module.exports = router

