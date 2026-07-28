const express = require('express');
const musicController = require('../controllers/musicController');

const router = express.Router();

router.post('/upload', musicController.creatMusic);


module.exports = router;