import { Router } from "express";
import {
    loginAdmin,
    getMe,
    registerAdmin,
    getAdminMembers,
    inviteAdminMember,
    verifyAdminOtp,
} from "../controllers/authController.js";
import { protect, superAdminOnly } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post("/login", loginAdmin);
authRouter.get("/me", protect, getMe);
authRouter.post("/register", registerAdmin);
authRouter.get("/members", protect, superAdminOnly, getAdminMembers);
authRouter.post("/members/invite", protect, superAdminOnly, inviteAdminMember);
authRouter.post("/members/verify-otp", protect, superAdminOnly, verifyAdminOtp);

export default authRouter;