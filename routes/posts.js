const express = require('express');
const {
    getAllPosts,
    getPost,
    createPost,
    deletePost,
    updatePost
} = require('../controllers/postController');

const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// require auth for all routes
router.use(requireAuth);

// routes

// GET ALL POSTS
router.get('/', getAllPosts);

// GET SPECIFIC POST
router.get('/:id', getPost)

// POST A NEW POST
router.post('/', createPost)

// UPDATE A POST
router.patch('/:id', updatePost);

// DELETE A POST
router.delete('/:id', deletePost);

module.exports = router;