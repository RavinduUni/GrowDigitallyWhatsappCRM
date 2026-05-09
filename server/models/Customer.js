import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        phone: { type: String, required: true, unique: true, trim: true },
        waId: { type: String, trim: true, unique: true },
        name: { type: String, trim: true },
        profileName: { type: String, trim: true },
        email: { type: String, trim: true },
        businessName: { type: String, trim: true },
        website: { type: String, trim: true },
        tags: [{ type: String }],
        notes: { type: String },
        lastActivityAt: Date,
    },
    { timestamps: true }
);

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;