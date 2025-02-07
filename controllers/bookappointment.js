const pool = require('../database')

exports.bookappointment = (req, res) =>{
    const {fullname, email, message, appointment_date, appointment_time} = req.body

    if (!email || !firstname) {
        return res.render(`bookappointment`, { error: `Please fill all Required Field` })
    }
}

