import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Token missing.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await Admin.findById(decoded.id).select("-password");

        if (!admin || !admin.isActive) {
            return res.status(401).json({
                success: false,
                message: "User not found or inactive.",
            });
        }

        req.admin = admin;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized. Token failed.",
        });
    }
};

export const superAdminOnly = (req, res, next) => {
    if (req.admin?.role !== "super_admin") {
        return res.status(403).json({
            success: false,
            message: "Only super admin can perform this action.",
        });
    }

    next();
};