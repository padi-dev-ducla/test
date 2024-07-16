const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number, 
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'confirmed', 'cancelled']
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
