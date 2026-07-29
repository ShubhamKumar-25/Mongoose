const musicModel = require('../models/musicModel');
const { uploadFile } = require('../services/storageService');
const jwt = require('jsonwebtoken');

async function creatMusic(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "You don't have permission to create music"
            });
        }

        const { title } = req.body;
        const file = req.file;

        // Agar tumhari service base64 expect karti hai to ye line sahi hai
        const result = await uploadFile(file.buffer.toString('base64'));

        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: decoded.id, // ✅ Corrected
        });

        res.status(200).json({
            message: "Music created successfully",
            id: music._id,
            uri: music.uri,
            title: music.title,
            artist: music.artist
        });
    } catch (err) {
        console.error("Error creating music:", err.message);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

module.exports = { creatMusic };
