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

        // const newPrompt = new Prompt({
        //     userId,
        //     text,
        //     category,
        //     description,
        // });

        // await newPrompt.save();

        // res.status(201).json({ message: 'Prompt added' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getUserPrompts,
    addPrompt,
};