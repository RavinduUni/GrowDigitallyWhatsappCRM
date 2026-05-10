import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "5h",
    });
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