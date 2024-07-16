const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const stripeController = require('../controllers/stripeController');

const middleware = require('../utils/middleware');

// Routes for booking
router.post('/', middleware.checkLogin, bookingController.bookCourse); 
router.get('/user/:userId', middleware.checkLogin, bookingController.getBookingsByUser); 
router.get('/mentor/:mentorId', middleware.checkLogin, bookingController.getBookingsByMentor); 
router.put('/cancel/:id', middleware.checkLogin, bookingController.cancelBooking);
router.post('/create-checkout-session', middleware.checkLogin, stripeController.createCheckoutSession);
router.post('/create-payment', middleware.checkLogin, stripeController.createPayment);

router.get('/', middleware.checkLogin, bookingController.getAllBookings); 

module.exports = router;
