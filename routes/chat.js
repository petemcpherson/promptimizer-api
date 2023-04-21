const express = require('express');
const { chatGPT } = require('../controllers/chatController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Require auth for all routes
router.use(requireAuth);

// ChatGPT route
// router.post('/', chatGPT);

router.post('/', (req, res, next) => {
    console.log('Request received at /api/chat');
    next();
  }, chatGPT);
  

module.exports = router;
