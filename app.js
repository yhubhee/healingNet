const express = require('express');
const cookieParser = require('cookie-parser');
const {createToken, validateTokens} = require('./middlewares/auth')
const env =  require('dotenv');


env.config({path: './env'})

const app = express();
const path = require('path');

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL encoded bodies as sent by HTML forms
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());


// Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.render('index');
});

// router.get('/dashboard', validateTokens,(req, res)=>{
//     res.render('dashboard')
// })

// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));