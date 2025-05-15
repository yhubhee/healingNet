const {sign,verify} = require("jsonwebtoken");
// Login tokens
const createToken = (doctors) =>{
    const docToken = sign(
        {
            doctor_id: doctors.doctor_id, 
            doc_name: doctors.doc_name
        }, 
        process.env.doc_JWT_SECRET, 
        {
        expiresIn: process.env.doc_JWT_EXPIRES_IN
    });
    // console.log(docToken)
    return docToken;

};

const doctorvalidateTokens = (req, res, next) =>{
    const docToken = req.cookies["doc-Token"];

    if(!docToken)
        return res.render('doctor/doctorlogin', {
            error: 'Doctor not authenticated'
        });

    try{
        const validToken = verify(docToken,process.env.doc_JWT_SECRET,)
        if(validToken){
            req.authenticated = true ;
            req.user = validToken;
            // console.log(validToken)
            return next()
        }
    }
    catch(err){
        return res.status(400).json({error: err})
    }
}
// Password reset tokens
const Doctor_reset_secret = (doctors) => {
    const Doctor_reset = sign(
        {
            doctor_id: doctors.doctor_id,
        },
        process.env.Doctor_reset_secret,
        {
            expiresIn: process.env.Doctor_reset_EXPIRES_IN
        }
    );

    return Doctor_reset;
};

const validateDoctor_reset_secret = (req, res, next) => {
    const DoctorResetToken = req.query.token || req.body.token; // Must be first
    console.log('Received token from auth:', DoctorResetToken);
    if (!DoctorResetToken) {
        return res.render('Doc_forgot_pass', { error: 'Missing token' });
    }
    try {
        const decoded = verify(DoctorResetToken, process.env.Doctor_reset_secret);
        req.authenticated = true;
        req.user = decoded;
        return next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.render('Doc_forgot_pass', { error: 'Reset token has expired. Please request a new one.' });
        }
        return res.render('doctorlogin', { error: 'Invalid token. Please try again.' });
    }
};


module.exports = {createToken, doctorvalidateTokens, Doctor_reset_secret, validateDoctor_reset_secret}