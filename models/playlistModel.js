const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const PlaylistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    private: {
        type: Boolean,
        default: true
    },
    user_id: {
        type: String,
        required: true
    },
    prompts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Prompt'
        }
    ],
    order: [Number],
    tags: [String]
}, { timestamps: true });

module.exports = Mongoose.model('Playlist', PlaylistSchema);