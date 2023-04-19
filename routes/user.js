const express = require('express');

const { loginUser, signupUser, initiatePasswordReset, resetPassword } = require('../controllers/userController');

const router = express.Router();

// routes

// LOGIN

router.post('/login', loginUser)

// SIGNUP

router.post('/signup', signupUser)

// initiate password reset

router.post('/forgot-password', initiatePasswordReset)

// reset password

router.put('/reset-password/:token', resetPassword)

module.exports = router;