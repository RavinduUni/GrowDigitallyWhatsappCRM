import { Router } from "express";
import {
    loginAdmin,
    getMe,
    createAdminMember,
} from "../controllers/authController.js";
import { protect, superAdminOnly } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post("/login", loginAdmin);
authRouter.get("/me", protect, getMe);
authRouter.post("/members", protect, superAdminOnly, createAdminMember);

export default authRouter;