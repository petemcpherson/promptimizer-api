const express = require('express');
const {
    getAllPlaylists,
    getPlaylist,
    createPlaylist,
    deletePlaylist,
    updatePlaylist
} = require('../controllers/playlistController');

const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// require auth for all routes
router.use(requireAuth);

// routes

// GET ALL PLAYLISTS

router.get('/', getAllPlaylists);

// GET A SPECIFIC PLAYLIST

router.get('/:id', getPlaylist);

// ADD A NEW PLAYLIST

router.post('/', createPlaylist);

// DELETE A PLAYLIST

router.delete('/:id', deletePlaylist);

// UPDATE A PLAYLIST

router.patch('/:id', updatePlaylist);

module.exports = router;
