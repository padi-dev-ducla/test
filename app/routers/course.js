const express = require('express');
const router = express.Router();
const middleware = require('../utils/middleware');
const courseController = require('../controllers/courseController');

// Routes for courses
router.post('/',  courseController.createCourse);
router.put('/:id',  courseController.updateCourse);
router.delete('/:id',  courseController.deleteCourse);
router.get('/', courseController.getAllCourses);
router.get('/search', courseController.searchCourse);
router.get('/:id', courseController.getCourseById);
router.post('/enroll/:id', courseController.enrollCourse);
router.post('/unenroll/:id', courseController.unenrollCourse);
router.get('/user/:userId', courseController.getCoursesByUserId);
router.get('/category/:categoryId', courseController.getCoursesByCategory);

module.exports = router;
