
const usermodel = require('../models/usermodel');
const router = require('../routes/authRoute');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function register(req, res){

    const { username, email, password, role='user' } = req.body;

    const isUserExist = await usermodel.findOne({

        $or:[
            { username },
            { email }
        ]
    });

    if(isUserExist){
        return res.status(400).json({
            message: "User already exista "
        })
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await usermodel.create({
        username,
        email,
        password: hash,
        role
    })

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRETS); 

    res.cookies = ('token', token);

    res.status(200).json({
        message: "User register succesfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
}

module.exports = { register };