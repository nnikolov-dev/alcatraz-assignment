const mongoose = require('mongoose');
const Schema = mongoose.Schema
const CommentSchema = new Schema(
    {
        username: {
            type: String,
            require: true
        },
        message: {
            type: String,
            require: true
        },
        upvotes: {
            type: Number,
            default: 0
        },
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Comment', CommentSchema);