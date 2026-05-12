import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { sendOtpEmail } from "../services/emailServices.js";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "5h",
    });
};

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required.",
            });
        }

        const exists = await Admin.findOne({ email });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "User already exists.",
            });
        }

        const admin = await Admin.create({
            name,
            email,
            password,
            role: "super_admin",
        });

        res.status(201).json({
            success: true,
            message: "Admin created successfully.",
            user: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create admin.",
            error: error.message,
        });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive.",
            });
        }

        const isMatch = await admin.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const token = generateToken(admin._id);

        res.json({
            success: true,
            token,
            user: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed.",
            error: error.message,
        });
    }
};

export const getMe = async (req, res) => {
    res.json({
        success: true,
        user: req.admin,
    });
};

export const createAdminMember = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required.",
            });
        }

        const exists = await Admin.findOne({ email });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "User already exists.",
            });
        }

        const member = await Admin.create({
            name,
            email,
            password,
            role: role || "agent",
        });

        res.status(201).json({
            success: true,
            message: "Member created successfully.",
            user: {
                _id: member._id,
                name: member.name,
                email: member.email,
                role: member.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create member.",
            error: error.message,
        });
    }
};


export const getAdminMembers = async (req, res) => {
    try {
        const members = await Admin.find()
            .select("-password -otpHash")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: members,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch admins",
            error: error.message,
        });
    }
};

export const inviteAdminMember = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required.",
            });
        }

        const allowedRoles = ["admin", "agent"];

        if (role && !allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Only admin or agent allowed.",
            });
        }

        let existing = await Admin.findOne({ email });

        if (existing && existing.isActive) {
            return res.status(400).json({
                success: false,
                message: "This admin already exists and is active.",
            });
        }

        const otp = generateOtp();
        const otpHash = await bcrypt.hash(otp, 10);

        if (existing && !existing.isActive) {
            existing.name = name;
            existing.password = password;
            existing.role = role || "admin";
            existing.otpHash = otpHash;
            existing.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
            await existing.save();
        } else {
            existing = await Admin.create({
                name,
                email,
                password,
                role: role || "admin",
                isActive: false,
                otpHash,
                otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
            });
        }

        await sendOtpEmail({
            to: email,
            name,
            otp,
        });

        res.status(201).json({
            success: true,
            message: "OTP sent to admin email.",
            data: {
                _id: existing._id,
                name: existing.name,
                email: existing.email,
                role: existing.role,
                isActive: existing.isActive,
            },
        });
    } catch (error) {
        console.error("INVITE ADMIN ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to invite admin.",
            error: error.message,
        });
    }
};

export const verifyAdminOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required.",
            });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found.",
            });
        }

        if (!admin.otpHash || !admin.otpExpiresAt) {
            return res.status(400).json({
                success: false,
                message: "No OTP request found.",
            });
        }

        if (admin.otpExpiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired. Please resend invite.",
            });
        }

        const isMatch = await admin.compareOtp(otp);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }

        admin.isActive = true;
        admin.otpHash = undefined;
        admin.otpExpiresAt = undefined;

        await admin.save();

        res.json({
            success: true,
            message: "Admin verified and activated successfully.",
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                isActive: admin.isActive,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to verify OTP.",
            error: error.message,
        });
    }
};