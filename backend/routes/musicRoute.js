const express = require('express');
const musicController = require('../controllers/musicController');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router();

router.post('/upload', upload.single("music"), musicController.creatMusic);

module.exports = router;