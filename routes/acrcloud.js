const express = require('express');
const router = express.Router();
const multer = require('multer');
const acrcloud = require('acrcloud');

const upload = multer({ dest: 'uploads/' });

const acr = new acrcloud({
    host: 'identify-eu-west-1.acrcloud.com',
    access_key: 'YOUR_ACCESS_KEY', // TODO: Replace with your access key
    access_secret: 'YOUR_ACCESS_SECRET' // TODO: Replace with your access secret
});

router.post('/recognize', upload.single('audio'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No audio file uploaded' });
    }
    acr.identify(req.file.path)
        .then(response => {
            res.json(response);
        })
        .catch(error => {
            console.error('ACRCloud error:', error);
            res.status(500).json({ msg: 'Error recognizing audio' });
        });
});

module.exports = router;