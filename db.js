const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB is connected successfully! WOW!');
    } catch(err) {
        console.error('Khm, we have got some troubles:', err);
        process.exit(1);
    }
};
module.exports = connectDB;