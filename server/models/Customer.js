import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    waId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    website: {
        type: String
    },
    businessName: {
        type: String
    }
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;