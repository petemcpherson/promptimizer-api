const Brand = require('../models/brandModel');
const Mongoose = require('mongoose');

// get all brands

const getAllBrands = async (req, res) => {
    const user_id = req.user._id;

    const brands = await Brand.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(brands);
}

// get a single brand

const getBrand = async (req, res) => {
    const { id } = req.params;
    try {
        const brand = await Brand.findById(id);
        res.status(200).json(brand);
    } catch (err) {
        res.status(404).json({ mssg: err.message });
    }

    // instead of the try/catch above, he did an if! statement to check if the brand exists first
    // also, he put a if! check to make sure it's a valid mongoose ID
}

// create a new brand

const createBrand = async (req, res) => {
    const { name, description, style, toneOne, toneTwo, avatar } = req.body;

    let emptyFields = [];

    if (!name) {
        emptyFields.push('name');
    }
    if (!description) {
        emptyFields.push('description');
    }
    if (!style) {
        emptyFields.push('style');
    }
    if (!toneOne) {
        emptyFields.push('adjective one');
    }
    if (!toneTwo) {
        emptyFields.push('adjective two');
    }
    if (!avatar) {
        emptyFields.push('avatar');
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: `Please fill in the following fields: ${emptyFields.join(', ')}`, emptyFields });
    }

    try {
        const user_id = req.user._id;
        const brand = await Brand.create({
            name,
            description,
            style,
            toneOne,
            toneTwo,
            avatar,
            user_id
        })
        res.status(201).json(brand);
    } catch (err) {
        res.status(400).json({ mssg: err.message });
    }
}

// delete a brand

const deleteBrand = async (req, res) => {
    const { id } = req.params;
    try {
        const brand = await Brand.findByIdAndDelete(id);
        res.status(200).json(brand);
    } catch (err) {
        res.status(404).json({ mssg: err.message });
    }
}

// update a brand

const updateBrand = async (req, res) => {
    const { id } = req.params;
    if (!Mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No brand with id: ${id}`);
    }

    const brand = await Brand.findOneAndUpdate({_id: id},{
        ...req.body
    })

    if (!brand) {
        return res.status(404).send(`No brand with id: ${id}`);
    }

    res.status(200).json(brand);

}

module.exports = {
    getAllBrands,
    getBrand,
    createBrand,
    deleteBrand,
    updateBrand
}