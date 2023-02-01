require('dotenv').config();
const jwt = require('jsonwebtoken');
const user = require('../models/user');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log(token);
        const userObj = jwt.verify(token, process.env.SECRET_KEY);

        user.findByPk(userObj.userId).then(userOBJECT => {

            console.log(JSON.stringify(userOBJECT));
            req.user = userOBJECT;
            next();
        })
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false })
    }
}
module.exports = {
    authenticate
}