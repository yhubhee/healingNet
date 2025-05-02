const express = require('express');
const cookieParser = require('cookie-parser');
const env = require('dotenv');
const pool = require('./database');
const pagesRoutes = require('./routes/pages');

env.config({ path: './env' });

const app = express();
const path = require('path');

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

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
    pool.query('SELECT * FROM doctors', (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            res.send({ rows });
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});