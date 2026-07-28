
const usermodel = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function register(req, res) {
    try {
        const { username, email, password, role = 'user' } = req.body;

        const isUserExist = await usermodel.findOne({
            $or: [{ username }, { email }]
        });

        if (isUserExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await usermodel.create({
            username,
            email,
            password: hash,
            role
        });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true });

        res.status(200).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function loginUser(req, res){

    const { username, email, password } = req.body;

    const user = await usermodel.findOne({
        
        $or:[
            { username }, 
            { email }
        ]
    });

    if(!user){
        return res.status(401).json({
            message: "Invalid credentials",
            error: error
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(401).json({
            message: "Invalid credentials";
        })
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h'}
    )

    res.cookie('token', token, { httpOnly: true })

    res.status(200).json({
        message: "User Login succesfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
};


module.exports = { register };
