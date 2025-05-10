const express = require('express');
const cookieParser = require('cookie-parser');
const env = require('dotenv');
const pool = require('./database');
const pagesRoutes = require('./routes/pages');
// require('events').setMaxListeners(20); 

env.config({ path: './env' });

const app = express();
const path = require('path');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse URL encoded bodies as sent by HTML forms
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Define Routes
app.use('/', pagesRoutes);
app.use('/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.render('ui/index');
});
app.get('/patients', (req, res) => {
    const sql = 'SELECT * FROM patients';

    pool.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(results).json; // or .json
    });
});
app.get('/bookappointment', (req, res) => {
    pool.query('Select doc_img FROM doctors', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send( result );
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});