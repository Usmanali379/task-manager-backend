const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    dueDate: {
        type: Date
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
taskSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task; 