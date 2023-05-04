const Post = require('../models/postModel');
const Mongoose = require('mongoose');

// get all posts

const getAllPosts = async (req, res) => {
    const user_id = req.user._id;

    const posts = await Post.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
}

// get a single post

const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ mssg: err.message });
    }
}

// create a new post

const createPost = async (req, res) => {
    const { keyword, facts, faqs } = req.body;

    let emptyFields = [];

    if (!keyword) {
        emptyFields.push('keyword');
    }


    if (emptyFields.length > 0) {
        return res.status(400).json({ error: `Please fill in the following fields: ${emptyFields.join(', ')}`, emptyFields });
    }

    try {
        const user_id = req.user._id;
        const post = await Post.create({
            keyword,
            facts,
            faqs,
            user_id
        });
        res.status(201).json(post);
    } catch (err) {
        res.status(400).json({ mssg: err.message });
    }
}

// delete a post

const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findByIdAndDelete(id);
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ mssg: err.message });
    }
}

// update a post

const updatePost = async (req, res) => {
    const { id } = req.params;
    if (!Mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ mssg: 'Post not found' });
    }

    const post = await Post.findOneAndUpdate({ _id: id }, {
        ...req.body
    })

    res.status(200).json(post);
}

// update chat history
const updateChatHistory = async (req, res) => {
    const { id } = req.params;
    const { chatHistory } = req.body;

    if (!Mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ mssg: 'Post not found' });
    }

    try {
        const post = await Post.findOneAndUpdate({ _id: id }, {
            chatHistory
        }, { new: true });

        res.status(200).json(post);
    } catch (err) {
        res.status(400).json({ mssg: err.message });
    }
};


module.exports = {
    getAllPosts,
    getPost,
    createPost,
    deletePost,
    updatePost,
    updateChatHistory
}