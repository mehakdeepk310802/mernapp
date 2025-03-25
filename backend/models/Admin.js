import mongoose from 'mongoose';

const { Schema } = mongoose;

const AdminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    resetToken: String,
    resetTokenExpiry: Date
});

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;