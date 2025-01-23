const {sign,verify} = require("jsonwebtoken");

const createToken = (patients) =>{
    const accessToken = sign({patient_id: patients.patient_id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    
    return accessToken;
};

const validateTokens = (req, res, next) =>{
    const accessToken = req.cookies["access-Token"];

    if(!accessToken)
        return res.render('login', {
            error: 'User not authenticated'
        }).status(400);

    try{
        const validToken = verify(accessToken,process.env.JWT_SECRET,)
        if(validToken){
            req.authenticated = true 
            return next()
        }
    }
    catch(err){
        return res.status(400).json({error: err})
    }
    }

module.exports = {createToken, validateTokens}