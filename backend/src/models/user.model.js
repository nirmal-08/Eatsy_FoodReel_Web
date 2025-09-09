import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({ // schema -> structure of the document
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    }
}, {
    timestamps: true
});

const userModel = mongoose.model('user', userSchema); // users -> collection name in db

export default userModel; // exporting the model to use it in other files
