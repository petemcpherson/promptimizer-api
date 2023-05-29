const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const PromptSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    category: {
        type: String,
    },
    description: {
        type: String,
    },
}, { timestamps: true });

module.exports = Mongoose.model('Prompt', PromptSchema);
