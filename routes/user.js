const express = require('express');

const { loginUser, initiatePasswordReset, resetPassword, validateToken, getUserPlan } = require('../controllers/userController');

const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// routes

// LOGIN

router.post('/login', loginUser)

// SIGNUP

// router.post('/signup', signupUser)

// initiate password reset

router.post('/forgot-password', initiatePasswordReset)

// reset password

router.put('/reset-password/:token', resetPassword)

// validate token

router.get('/validate-token/:token', validateToken)

// get a user's plan

router.get('/plan', requireAuth ,getUserPlan)

module.exports = router;