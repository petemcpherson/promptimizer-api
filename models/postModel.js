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
    factOne: {
        type: String,
        required: false
    },
    factTwo: {
        type: String,
        required: false
    },
    factThree: {
        type: String,
        required: false
    },
    factFour: {
        type: String,
        required: false
    },
    factFive: {
        type: String,
        required: false
    },
    faqOne: {
        type: String,
        required: false
    },
    faqTwo: {
        type: String,
        required: false
    },
    faqThree: {
        type: String,
        required: false
    },
    faqFour: {
        type: String,
        required: false
    },
    faqFive: {
        type: String,
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