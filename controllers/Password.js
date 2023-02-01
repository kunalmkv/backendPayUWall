const forgot = require('../models/password');
const User = require('../models/user');
const uuid = require('uuid');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const config = require('../config/config');
const sendResetPasswordMail = async (name, email, id) => {
    try {

        //let testAccount = await nodemailer.createTestAccount();
        const transporter = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });
        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'Reset Password',
            html: `<p> Hiii ${name}, Please copy the link and<a href=http://localhost:3000/password/resetpassword/${id}>  reset pssword </a>`
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('mail has been sent', info.response)
            }
        })

    } catch (error) {
        //return res.status(400).send({ success: false, message: error.message })
        return error;
    }
}
const hashedPassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
const forgotPassword = async (req, res, next) => {
    const email = req.body.mail;


    try {
        const userData = await User.findOne({ where: { email: email } });

        if (userData) {
            const id = uuid.v4();
            const data = await forgot.create({ id: id, email: email, active: true }).catch(err => {
                console.log(err);
                throw new Error(err)

            })
            console.log('********', userData.userName, userData.email, id);
            sendResetPasswordMail(userData.userName, userData.email, id);

            return res.status(200).send({ success: true, message: 'Please check your inbox and follow link to reset' });

        }
        else {
            return res.status(200).json({ success: true, message: 'email not found' });
        }

    }
    catch (error) {
        res.status(400).json({ success: false, message: 'failed' });
    }

}
/*const resetPassword = async (req, res) => {
    try {
        const token = req.query.token;

        const tokenData = await forgot.findOne({ where: { token: token } }).then()

        if (tokenData) {
            const password = req.body.password;
            const newHashedPassword = await hashedPassword(password);
            const userdata = await User.update(
                { password: newHashedPassword },
                { where: { email: tokenData.email } }

            )
            res.status(200).json({ success: true, message: 'password has been reset', data: userdata })

        }
        else {
            res.status(200).json({ success: true, message: 'link has been expired' })
        }


    } catch (error) {
        res.status(400).json({ success: false, message: 'failed' })

    }
}*/

const resetpassword = async (req, res) => {
    console.log('###3######', req.query);
    // const id = req.query.id;
    const id = req.params.id;
    console.log('###3######', id);
    await forgot.findOne({ where: { id: id } }).then(forgotpasswordrequest => {
        console.log(forgotpasswordrequest);
        if (forgotpasswordrequest) {
            forgotpasswordrequest.update({ active: false });
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
            )
            res.end()

        }
    })
}

const updatepassword = (req, res) => {

    try {
        const newpassword = req.params;
        const resetpasswordid = req.params;
        forgot.findOne({ where: { id: resetpasswordid } }).then(resetpasswordrequest => {
            User.findOne({ where: { id: resetpasswordrequest.userId } }).then(user => {
                // console.log('userDetails', user)
                if (user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function (err, hash) {
                            // Store hash in your password DB.
                            if (err) {
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({ message: 'Successfuly update the new password' })
                            })
                        });
                    });
                } else {
                    return res.status(404).json({ error: 'No user Exists', success: false })
                }
            })
        })
    } catch (error) {
        return res.status(403).json({ error, success: false })
    }

}

module.exports = {
    forgotPassword,
    resetpassword,
    updatepassword
}
