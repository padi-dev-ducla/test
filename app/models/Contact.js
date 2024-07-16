const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Replied', 'Unreplied'],
        default: 'Unreplied'
    }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
