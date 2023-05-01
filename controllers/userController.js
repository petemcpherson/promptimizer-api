const User = require('../models/userModel');
const Prompt = require('../models/promptModel');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');


// configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_SES_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

// tokens

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '7d' });
}


// password reset

const initiatePasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'User does not exist' });
        }

        const token = createToken(user._id);
        // might need to change this email
        const resetUrl = `${process.env.PUBLIC_URL}/reset-password/${token}`;
        const mailOptions = {
            Source: 'pete@doyouevenblog.com',
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Subject: {
                    Data: 'Password Reset',
                },
                Body: {
                    Text: {
                        Data: `Please use the following link to reset your password: ${resetUrl}`,
                    },
                },
            },
        };

        ses.sendEmail(mailOptions, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ error: 'Error sending email' });
            } else {
                console.log(data);
                return res.status(200).json({ message: 'Email sent' });
            }
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    console.log('Reset password request received', token, newPassword); // Add this line


    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        await user.resetPassword(newPassword);
        res.status(200).json({ message: 'Password updated' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


// login user

const loginUser = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        //create a token
        const token = createToken(user._id);

        res.status(201).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


// signup user

const signupUser = async (req, res) => {

    const { firstName, lastName, email, password } = req.body;

    try {
        const user = await User.signup(firstName, lastName, email, password);

        //create a token
        const token = createToken(user._id);
        res.status(201).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = { loginUser, signupUser, initiatePasswordReset, resetPassword };
