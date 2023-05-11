const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const checkWordLimit = require('../middleware/checkWordLimit');
const { chatCompletion } = require('../controllers/chatController');


const router = express.Router();

// Require auth for all routes
router.use(requireAuth);

// ChatGPT route
// router.post('/', chatGPT);

router.post('/', (req, res, next) => {
    console.log('Request received at /api/chat');
    next();
  }, checkWordLimit, chatCompletion);
  

module.exports = router;
