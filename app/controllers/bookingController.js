const BookingModel = require('../models/Booking');
const CourseModel = require('../models/course');
const UserModel = require('../models/user');

const bookingController = {
    bookCourse: async (req, res) => {
        const { userId, courseId, mentorId, price  } = req.body;

        try {
            const existingBooking = await BookingModel.findOne({ user: userId, course: courseId });
            if (existingBooking) {
                return res.status(200).json({ message: 'Bạn đã mua khóa học này trước đó!' });
            }

            
            const course = await CourseModel.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }


            const newBooking = new BookingModel({
                user: userId,
                course: courseId,
                mentor: mentorId || null,
                price: price
            });

            user.balance -= price;
            await user.save();

            const savedBooking = await newBooking.save();
            res.status(200).json({ data: savedBooking });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getBookingsByUser: async (req, res) => {
        const userId = req.params.userId;

        try {
            const bookings = await BookingModel.find({ user: userId })
                .populate('course')
                .populate('mentor');

            res.status(200).json({ data: bookings });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getBookingsByMentor: async (req, res) => {
        const mentorId = req.params.mentorId;
    
        try {
            const bookings = await BookingModel.find({})
                .populate({
                    path: 'course',
                    match: { mentor: mentorId }
                })
                .populate('user')
                .exec();
    
            // Lọc ra những booking mà course có mentor trùng với mentorId
            const filteredBookings = bookings.filter(booking => booking.course !== null);
    
            res.status(200).json({ data: filteredBookings });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    cancelBooking: async (req, res) => {
        const bookingId = req.params.id;

        try {
            const booking = await BookingModel.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            booking.status = 'cancelled';
            await booking.save();

            res.status(200).json({ message: 'Booking cancelled successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getAllBookings: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1000;

        try {
            // Lấy tất cả các booking với phân trang
            const bookings = await BookingModel.find({})
                .populate('course')
                .populate('user')
                .populate('mentor')
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();

            // Đếm tổng số lượng booking
            const totalBookings = await BookingModel.countDocuments({});

            res.status(200).json({
                data: bookings,
                currentPage: page,
                totalPages: Math.ceil(totalBookings / limit),
                totalBookings
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = bookingController;
