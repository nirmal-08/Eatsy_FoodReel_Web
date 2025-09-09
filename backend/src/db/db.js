// const mongoose = require('mongoose');

    import mongoose from 'mongoose';
  
    function connectDB() {
        
        mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            // console.log('DB connected');
        })
        .catch((err) => {
            console.log('DB connection error', err);
        });
    }

    export default connectDB;