const Playlist = require('../models/playlistModel');
const Mongoose = require('mongoose');

// get all playlists

const getAllPlaylists = async (req, res) => {
    const user_id = req.user._id;

    try {
        const playlists = await Playlist.find({ user_id });

        if (!playlists) {
            return res.status(400).json({ error: 'No playlists found' });
        }

        res.status(200).json(playlists);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// get a single playlist

const getPlaylist = async (req, res) => {
    const { id } = req.params;
    try {
        const playlist = await Playlist.findById(id);

        if (!playlist) {
            return res.status(400).json({ error: 'No playlist found' });
        }

        res.status(200).json(playlist);
    } catch (err) {
        res.status(404).json({ mssg: err.message });
    }
}

// create a new playlist

const createPlaylist = async (req, res) => {
    const {
        name,
        description,
        private,
        prompts,
        order
    } = req.body;

    let emptyFields = [];

    // later, I'll add logic for checking required fields

    try {
        const user_id = req.user._id;
        const playlist = await Playlist.create({
            name,
            description,
            private,
            prompts,
            order,
            user_id
        });
        res.status(201).json(playlist);
    } catch (err) {
        res.status(400).json({ mssg: err.message });
    }
}

// update a playlist

const updatePlaylist = async (req, res) => {
    const { id } = req.params;
    const {
        name,
        description,
        private,
        prompts,
        order
    } = req.body;

    if (!Mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No playlist found' });
    }

    try {
        const playlist = await Playlist.findByIdAndUpdate(id, {
            name,
            description,
            private,
            prompts,
            order
        }, { new: true });

        if (!playlist) {
            return res.status(400).json({ error: 'No playlist found' });
        }

        // might not need the above?
        // might have to change playlist to updatedPlaylist

        res.status(200).json(playlist);
    } catch (err) {
        res.status(400).json({ mssg: err.message });
    }
}

// delete a playlist

const deletePlaylist = async (req, res) => {
    const { id } = req.params;
    try {
        const playlist = await Playlist.findByIdAndDelete(id);
        res.status(200).json(playlist);
    } catch (err) {
        res.status(404).json({ mssg: err.message });
    }
}

module.exports = {
    getAllPlaylists,
    getPlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist
};