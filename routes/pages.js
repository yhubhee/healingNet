const express = require('express');
const router = express.Router();
const { validateTokens } = require('../middlewares/auth');
const { doctorvalidateTokens } = require('../middlewares/authdoctor')

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
router.get('/logout', (req, res)=>{
    res.render('login')
})
router.get('/features', (req, res) => {
    res.render('features');
});
router.get('/creataccount', (req, res) => {
    res.render('register');
});
router.get('/signup', (req, res) => {
    res.render('signup');
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/pre-dashboard', (req, res)=>{
    res.render('pre-dashboard')
})
router.get('/dashboard', validateTokens, (req, res) => {
    const { firstname, lastname } = req.user; // Access the attached names
    res.render('dashboard', {
        firstname,
        lastname
    });
});
router.get('/myappointments', validateTokens, (req, res) => {
    const { firstname, lastname } = req.user; // Access the attached names
    res.render('myappointments', {
        firstname,
        lastname
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
    const { firstname, lastname } = req.user; // Access the attached names
    res.render('doctordashboard', {
        firstname,
        lastname
    });
});





module.exports = router