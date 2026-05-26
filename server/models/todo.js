const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    time: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Todo', todoSchema);
