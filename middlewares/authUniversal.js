const { verify } = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const docToken = req.cookies["doc-Token"];
    const accessToken = req.cookies["access-Token"];

    if (docToken) {
        try {
            const validToken = verify(docToken, process.env.doc_JWT_SECRET);
            // console.log("Decoded doc token:", validToken);
            req.user = validToken;
            req.user.role = 'doctor';
            return next();
        } catch (err) {
            // invalid doctor token
        }
    }
    if (accessToken) {
        try {
            const validToken = verify(accessToken, process.env.JWT_SECRET);
            // console.log("Decoded patient token:", validToken);
            req.user = validToken;
            req.user.role = 'patient';
            return next();
        } catch (err) {
            // invalid patient token
        }
    }
    return res.status(401).json({ error: 'Not authenticated' });
};