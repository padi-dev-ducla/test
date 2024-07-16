const { UploadClient } = require('@uploadcare/upload-client');
const multer = require('multer');

const publicKey = '457ff1b3146fa618b2f8';
const secretKey = '96f42fdb590ca9646372';

const client = new UploadClient({
    publicKey,
    secretKey,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const UploadController = {
    uploadImage: async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No image provided in the request' });
        }

        try {
            const ucareFile = await client.file.upload(req.file.buffer);

            const fileUrl = ucareFile.cdnUrl;

            res.status(200).json({ url: `${fileUrl}-/preview/900x600/` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = { UploadController, upload };
