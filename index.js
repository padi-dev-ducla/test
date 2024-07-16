const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const DB_MONGO = require('./app/config/db.config')
const _CONST = require('./app/config/constant')

//router
const authRoute = require('./app/routers/auth');
const userRoute = require('./app/routers/user');
const categoryRoute = require('./app/routers/category');
const uploadFileRoute = require('./app/routers/uploadFile');
const newsRoute = require('./app/routers/news');
const contactRoute = require('./app/routers/contact');
const courseRoute = require('./app/routers/course');
const bookingRoutes = require('./app/routers/booking');
const uploadRoutes = require('./app/routers/upload');
const statsRouter = require('./app/routers/stats');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

mongoose.connect(DB_MONGO.URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB.');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/category', categoryRoute);
app.use('/api/uploadFile', uploadFileRoute);
app.use('/api/news', newsRoute);
app.use('/api/course', courseRoute);
app.use('/api/contacts', contactRoute);
app.use('/uploads', express.static('uploads'));
app.use('/api/bookings', bookingRoutes); 
app.use('/api/upload-image', uploadRoutes);
app.use('/api/stats', statsRouter);

const PORT = process.env.PORT || _CONST.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});