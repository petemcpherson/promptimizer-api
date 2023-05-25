const express = require('express');
const {
    getUserPrompts,
    getAllPrompts,
    getPrompt,
    addPrompt,
    deletePrompt,
    updatePrompt
} = require('../controllers/promptController');

const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// require auth for all routes
router.use(requireAuth);

// routes

// GET USER PROMPTS

router.get('/', getUserPrompts);

// GET ALL PROMPTS

router.get('/all', getAllPrompts);

// GET A SPECIFIC PROMPT

router.get('/:id', getPrompt);

// ADD A NEW PROMPT

router.post('/', addPrompt);

// DELETE A PROMPT

router.delete('/:id', deletePrompt);

// UPDATE A PROMPT

router.patch('/:id', updatePrompt);

module.exports = router;