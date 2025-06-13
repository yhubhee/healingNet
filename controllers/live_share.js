const fs = require('fs');
const pool = require('../database');
const multer = require('multer');
const path = require('path');

// Configure Multer with dynamic destination
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let userId;
        if (req.user && req.user.doctor_id) {
            userId = req.user.doctor_id;
        } else if (req.user && req.user.patient_id) {
            userId = req.user.patient_id;
        } else {
            return cb(new Error('User ID not found in req.user'), null);
        }
        const userDir = path.join('uploads', String(userId));
        fs.mkdir(userDir, { recursive: true }, (err) => {
            if (err) return cb(err, null);
            cb(null, userDir);
        });
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

exports.live_share = (req, res) => {
    console.log("req.user in live_share:", req.user); // <-- Add this line
    upload.single('imagefile')(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.render('consultation/live_consultation', { error: 'Failed to upload image' });
        }
        let userId, doctorId = null, patientId = null, role = null;
        // Determine userId, doctorId, patientId, and role based on req.user
        if (req.user && req.user.doctor_id) {
            userId = req.user.doctor_id;
            doctorId = userId;
            role = 'doctor';
        } 
        else if (req.user && req.user.patient_id) {
            userId = req.user.patient_id;
            patientId = userId;
            role = 'patient';
        } else {
            userId = null;
        }
        if (req.query.role) {
            role = req.query.role;
        }
        const imagefile = req.file ? req.file.filename : null;
        console.log("User ID:", userId, "Role:", role, "Image file:", imagefile);

        const filePath = `/uploads/${userId}/${imagefile}`;

        // Only insert if doctorId or patientId is set
        if (imagefile && (doctorId || patientId)) {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log("Error getting DB connection", err);
                    return res.status(500).json({ error: 'Database connection error' });
                }
                const sql = 'INSERT INTO shared_files (doctor_id, patient_id, filename, path, uploaded_at) VALUES (?, ?, ?, ?, NOW())';
                connection.query(sql, [doctorId, patientId, imagefile, filePath], (err, result) => {
                    connection.release();
                    if (err) {
                        console.log("Database error", err);
                        return res.status(500).json({ error: 'Failed to save file info to database' });
                    }
                    res.json({ success: true, file: filePath });
                    console.log("File Insert success", filePath)
                });
            });
        } else {
            res.status(400).json({ error: 'Missing file or user ID/role' });
        }
    });
};