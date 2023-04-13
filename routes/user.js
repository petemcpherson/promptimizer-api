const express = require('express');

const { loginUser, signupUser } = require('../controllers/userController');

const router = express.Router();

// routes

// LOGIN

router.post('/login', loginUser)

// SIGNUP

router.post('/signup', signupUser)

module.exports = router;