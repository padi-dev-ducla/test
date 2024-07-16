const User = require('../models/user');
const Course = require('../models/course');
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');
const Category = require('../models/category');

const statsController = {
    getCounts: async (req, res) => {
        try {
            const userCount = await User.countDocuments();
            const courseCount = await Course.countDocuments();
            const bookingCount = await Booking.countDocuments();
            const contactCount = await Contact.countDocuments();
            const categoryCount = await Category.countDocuments();

            res.status(200).json({
                users: userCount,
                courses: courseCount,
                bookings: bookingCount,
                contacts: contactCount,
                category: categoryCount
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = statsController;
