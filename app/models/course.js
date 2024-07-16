const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    slug: {
        type: String,
        default: ''
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    lessons: [{
        title: { type: String, required: true },
        videoUrl: { type: String, required: true } 
    }],
    image: {
        type: String,
        default: 'https://example.com/default.jpg'
    },
    price: { 
        type: Number,
        required: true
    },
    mentor: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    }
}, { timestamps: true });

CourseSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Course', CourseSchema);
