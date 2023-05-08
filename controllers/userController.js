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

// old token
// const createToken = (_id) => {
//     return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '7d' });
// }

const createToken = (_id, email) => {
    const payload = email ? { email } : { _id };
    return jwt.sign(payload, process.env.SECRET, { expiresIn: '7d' });
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

// complete registration

// const completeRegistration = async (req, res) => {
//     const { token } = req.params;
//     const { firstName, lastName, email, password } = req.body;

//     try {
//         // verify the token
//         const decoded = jwt.verify(token, process.env.SECRET);

//         // Check if the user already exists
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//             return res.status(400).json({ error: 'User already exists' });
//         }

//         // Create a new user
//         const user = await User.signup(firstName, lastName, email, password);

//         // send a response
//         res.status(200).json({ message: 'Registration completed successfully' });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// }


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

// const signupUser = async (req, res) => {

//     const { firstName, lastName, email, password, token, plan } = req.body;

//     // Check for the token
//     if (!token) {
//         return res.status(400).json({ error: 'Token is missing' });
//     }

//     // Verify the token
//     try {
//         jwt.verify(token, process.env.SECRET);
//         console.log('Token verified')
//     } catch (error) {
//         return res.status(400).json({ error: 'Invalid token' });
//     }

//     try {
//         const user = await User.signup(firstName, lastName, email, password);
//         // weird one
//         await User.findByIdAndUpdate(user._id, { plan });

//         //create a token
//         const token = createToken(user._id);

//         //email stuff

//         const registrationUrl = `${process.env.PUBLIC_URL}/signup/${token}`;
//         const mailOptions = {
//             Source: 'pete@doyouevenblog.com',
//             Destination: {
//                 ToAddresses: [email],
//             },
//             Message: {
//                 Subject: {
//                     Data: 'Complete Your Registration',
//                 },
//                 Body: {
//                     Text: {
//                         Data: `Please use the following link to complete your registration: ${registrationUrl}`,
//                     },
//                 },
//             },
//         };

//         ses.sendEmail(mailOptions, (err, data) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(400).json({ error: 'Error sending email' });
//             } else {
//                 console.log(data);
//                 return res.status(200).json({ message: 'Email sent' });
//             }
//         });


//         res.status(201).json({ email, token });

//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// }

const validateToken = async (req, res) => {
    const { token } = req.params;
    console.log('Token received:', token);


    try {
        jwt.verify(token, process.env.SECRET);

        res.status(200).json({ message: 'Valid token.' });
    } catch (error) {
        console.log('Error:', error.message);

        res.status(500).json({ message: 'Server error.', error: error.message });
    }

}

const resetAllUsersTokenUsage = async () => {
    const now = new Date();
    const update = {
        'tokenUsage.totalTokens': 0,
        'tokenUsage.resetDate': now,
    };

    // Update all users in the database
    await User.updateMany({}, { $set: update });
};

// send registration email

const sendRegistrationEmail = async (user) => {
    const token = createToken(user._id);
    const registrationUrl = `${process.env.PUBLIC_URL}/signup/${token}`;
    const mailOptions = {
        Source: 'Promptimizer <pete@doyouevenblog.com>',
        Destination: {
            ToAddresses: [user.email],
        },
        Message: {
            Subject: {
                Data: '[Action Required] Complete your registration! (Promptimizer)',
            },
            Body: {
                Text: {
                    Data: `Hey hey! A BIG WELCOME to Promptimizer!
                    <br>But before you do anything else, you 100% HAVE to use the following link to complete your registration: ${registrationUrl} <br>
                    
After you set a password there, you can log in and use the app.<br>
~Pete "Promptimizer" McPherson`,
                },
            },
        },
    };

    ses.sendEmail(mailOptions, (err, data) => {
        if (err) {
            console.log(err);
            throw Error('Error sending email');
        } else {
            console.log(data);
        }
    });
};




module.exports = { loginUser, initiatePasswordReset, resetPassword, resetAllUsersTokenUsage, validateToken, sendRegistrationEmail };
