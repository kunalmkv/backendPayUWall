
const user = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, userName: name, ispremiumuser }, '9868314748');
}
function stringInvalid(str) {
    if (str == undefined || str.length == 0 || str == null)
        return true;
    else return false;
}

const login = async (req, res, next) => {
    try {

        const mail = req.body.mail;
        const password = req.body.pw;
        if (stringInvalid(password) || stringInvalid(mail)) {
            console.log('wrong parameters');
            return res.status(400).json({ success: false, err: "Missing input parameters" });

        }
        await user.findAll({ where: { email: mail } }).then(user => {
            if (user.length > 0) {
                console.log('***password***', user[0].password);
                bcrypt.compare(password, user[0].password, (err, response) => {
                    if (err) {
                        return res.json({ success: false, message: 'something went wrong' });
                    }
                    if (response) {

                        return res.status(200).json({ success: true, message: 'Successfully Logged IN', token: generateAccessToken(user[0].id, user[0].userName, user[0].ispremiumuser) });
                    }
                    else {
                        return res.status(401).json({ success: false, message: 'password incorrect' })
                    }
                })

            }
            else {
                return res.status(401).json({ success: false, message: 'User doesnt exist' });
            }

        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err, success: false })
    }
}
module.exports = {
    login,
    generateAccessToken

}
