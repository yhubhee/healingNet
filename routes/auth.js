const express = require('express');
const router = express.Router();
const register = require('../controllers/register')
const login = require('../controllers/login')
const doclogin = require('../controllers/doctorlogin')



// 'auth/register
router.post('/signup', register.register)
router.post('/login', login.login)

//Doctor Auth
router.post('/doctorregister', register.doctorregister)
router.post('/doctorlogin', doclogin.doctorlogin)

module.exports = router