const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const BrandSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    style: {
        type: String,
        required: true
    },
    toneOne: {
        type: String,
        required: true
    },
    toneTwo: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = Mongoose.model('Brand', BrandSchema);