const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./database');
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy(
    function(username, password, done) {
        db.query('SELECT * FROM patients WHERE email = ?', [username], function(err, results) {
            if (err) { return done(err); }
            if (!results.length) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) { return done(err); }
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.patient_id);
});

passport.deserializeUser(function(id, done) {
    db.query('SELECT * FROM patients WHERE patient_id = ?', [id], function(err, results) {
        if (err) { return done(err); }
        done(null, results[0]);
    });
});

module.exports = passport;