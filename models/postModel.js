const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const MessageSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'chatgpt']
    },
    content: {
        type: String,
        required: true
    }
}, { _id: false });


const PostSchema = new Schema({
    keyword: {
        type: String,
        required: true
    },
    facts: {
        type: [String],
        required: false
    },
    faqs: {
        type: [String],
        required: false
    },
    user_id: {
        type: String,
        required: true
    },
    chatHistory: {
        type: [MessageSchema],
        default: []
    }
}, { timestamps: true });

module.exports = Mongoose.model('Post', PostSchema);