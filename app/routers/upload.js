const express = require('express');
const { UploadController, upload } = require('../controllers/uploadController');

const router = express.Router();

router.post('/upload-image', upload.single('image'), UploadController.uploadImage);

module.exports = router;
