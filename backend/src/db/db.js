// const mongoose = require('mongoose');

    import mongoose from 'mongoose';

    function connectDB() {
        
        mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://nirmal:vala%402525@cluster0.cjc1opj.mongodb.net/food-view")
        .then(() => {
            console.log('DB connected');
        })
        .catch((err) => {
            console.log('DB connection error', err);
        });
    }

    export default connectDB;