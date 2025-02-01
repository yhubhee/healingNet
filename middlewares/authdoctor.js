const {sign,verify} = require("jsonwebtoken");

const createToken = (doctors) =>{
    const docToken = sign(
        {
            doctor_id: doctors.doctor_id,
            firstname: doctors.firstname, 
            lastname: doctors.lastname
        }, 
        process.env.doc_JWT_SECRET, 
        {
        expiresIn: process.env.doc_JWT_EXPIRES_IN
    });
    
    return docToken;
};

const doctorvalidateTokens = (req, res, next) =>{
    const docToken = req.cookies["doc-Token"];

    if(!docToken)
        return res.render('doctorlogin', {
            error: 'Doctor not authenticated'
        }).status(400);

    try{
        const validToken = verify(docToken,process.env.doc_JWT_SECRET,)
        if(validToken){
            req.authenticated = true ;
            req.user = validToken;
            return next()
        }
    }
    catch(err){
        return res.status(400).json({error: err})
    }
    }

module.exports = {createToken, doctorvalidateTokens}