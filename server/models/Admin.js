import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
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
    role: {
        type: String,
        enum: ['admin', 'agent'],
        default: 'agent'
    },
    image: {
        public_id: String,
        url: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    lastSeen: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;