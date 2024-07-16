const stripe = require('stripe')(require('../config/stripe').secretKey);
const YOUR_DOMAIN = 'http://localhost:3500';
const BookingModel = require('../models/Booking');
const CourseModel = require('../models/course');
const UserModel = require('../models/user');

const createCheckoutSession = async (req, res) => {
    console.log(req.body)
    const { userId, courseId, mentorId } = req.body;

    try {
        const existingBooking = await BookingModel.findOne({ user: userId, course: courseId });
        if (existingBooking) {
            return res.status(200).json({ message: 'Bạn đã mua khóa học này trước đó!' });
        }

         // Tìm kiếm thông tin khóa học, người dùng, và mentor
         const course = await CourseModel.findById(courseId);
         if (!course) {
             return res.status(404).json({ message: 'Course not found' });
         }
 
         const user = await UserModel.findById(userId);
         if (!user) {
             return res.status(404).json({ message: 'User not found' });
         }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name || "product",
                    },
                    unit_amount: parseInt(Number(item.price)),
                },
                quantity: parseInt(item.qty),
            })),
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/cancel`,
        });

        // Lưu thông tin booking vào cơ sở dữ liệu
        const newBooking = new BookingModel({
            user: userId,
            course: courseId,
            mentor: mentorId,
            price: req.body.items.reduce((acc, curr) => acc + curr.price * curr.qty, 0)
        });

        const savedBooking = await newBooking.save();
        console.log({ id: session.id, data: session.url, booking: savedBooking })
        res.json({ id: session.id, data: session.url, booking: savedBooking });

    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error.message });
    }
};

const depositMoney = async (userId, amount) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.balance += amount;
        await user.save();

        return user;
    } catch (error) {
        throw error;
    }
};

const createPayment = async (req, res) => {
    const { userId, items } = req.body;
    console.log(req.body.items.map(item => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: "Nạp tiền vào tài khoản!",
            },
            unit_amount: parseInt(item.price/23000),
        },
        quantity: parseInt(item.qty),
    })));

    try {
         const user = await UserModel.findById(userId);
         if (!user) {
             return res.status(404).json({ message: 'User not found' });
         }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: "Nạp tiền vào tài khoản!",
                    },
                    unit_amount: parseInt(Number(item.price)/23000),
                },
                quantity: parseInt(item.qty),
            })),
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/cancel`,
        });

        await depositMoney(userId, req.body.items.reduce((acc, curr) => acc + curr.price * curr.qty, 0));

        res.json({ id: session.id, data: session.url });

    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error.message });
    }
};


module.exports = {
    createCheckoutSession,
    createPayment
};
