const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const { connect } = require('mongoose');
const authRoutes = require('./routes/authRoute');
const musicRoutes = require('./routes/musicRoute');
const app = express();


connectDB();
require('dotenv').config();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('./api/music', musicRoutes)

app.get('/', (req, res) => {
    res.end("Hello from sever");
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`server is running on localhost ${PORT}`);
    
})