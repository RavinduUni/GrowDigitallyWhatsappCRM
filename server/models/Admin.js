import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["super_admin", "admin", "agent"],
            default: "agent",
        },

        isActive: {
            type: Boolean,
            default: true,
        },
        otpHash: String,
        otpExpiresAt: Date,
    },
    { timestamps: true }
);

adminSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

adminSchema.methods.compareOtp = async function (otp) {
    return bcrypt.compare(otp, this.otpHash);
};


const Admin = mongoose.model("Admin", adminSchema);

export default Admin;