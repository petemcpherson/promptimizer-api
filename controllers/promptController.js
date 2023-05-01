const Prompt = require('../models/promptModel');
const Mongoose = require('mongoose');



// get all user prompts

const getUserPrompts = async (req, res) => {
    const user_id = req.user._id;

    try {
        const prompts = await Prompt.find({ user_id });

        if (!prompts) {
            return res.status(400).json({ error: 'No prompts found' });
        }

        res.status(200).json(prompts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// get a single prompt

const getPrompt = async (req, res) => {
    const { id } = req.params;

    try {
        const prompt = await Prompt.findById(id);

        if (!prompt) {
            return res.status(400).json({ error: 'No prompt found' });
        }

        res.status(200).json(prompt);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


// add a new prompt

const addPrompt = async (req, res) => {
    const { text, category, description } = req.body;

    try {
        const user_id = req.user._id;
        const prompt = await Prompt.create({
            text,
            category,
            description,
            user_id
        });
        res.status(201).json(prompt);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// delete a prompt

const deletePrompt = async (req, res) => {
    const { id } = req.params;
    try {
        const prompt = await Prompt.findByIdAndDelete(id);
        res.status(200).json(prompt);
    } catch (err) {
        res.status(404).json({ mssg: err.message });
    }
}

// update a prompt

const updatePrompt = async (req, res) => {
    const { id } = req.params;
    const { text, category, description } = req.body;
    if (!Mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No prompt with id: ${id}`);
    }

    console.log(`Update request received for id: ${id}`); // Add this line


    try {
        const updatedPrompt = await Prompt.findByIdAndUpdate(
            id,
            { text, category, description },
            { new: true }
        );

        res.status(200).json(updatedPrompt);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }


}

module.exports = {
    getUserPrompts,
    getPrompt,
    addPrompt,
    deletePrompt,
    updatePrompt
};