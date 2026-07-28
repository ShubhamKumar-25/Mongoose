
const musicModel = require('../models/musicModel');
const { uploadFile } = require('../services/storageService');
const jwt = require('jsonwebtoken');


async function creatMusic(req, res){

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: "Unauthorized"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.role !== "artist"){
            return res.status(403).json({
                message: "You don't able to create a music"
            })
        }
        
    } catch (error) {
        return res.status(401).json({
            message: "unauthorized"
        })
    }

    const { title } = req.body;
    const file = req.file;

    const result = await uploadFile(file.buffer.toString('base64'));

    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: decode.id,
    })

    res.status(200).json({
        message: "Music created succesfully",
        id: music._id,
        uri: music.uri,
        title: music.title,
        artist: music.artist
    })

}

module.exports = { creatMusic };