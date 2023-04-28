const express = require('express');
const {
    getUserPrompts,
    addPrompt,
} = require('../controllers/promptController');

const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// require auth for all routes
router.use(requireAuth);

// routes

// GET ALL PROMPTS

router.get('/', getUserPrompts);

// ADD A NEW PROMPT

router.post('/', addPrompt);

module.exports = router;