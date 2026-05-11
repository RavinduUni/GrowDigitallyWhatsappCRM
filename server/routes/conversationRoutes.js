import { Router } from "express";
import {
    getConversations,
    markConversationAsRead,
    updateConversationStatus,
    takeoverConversation,
    toggleAI,
} from "../controllers/conversationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const conversationRouter = Router();

conversationRouter.get("/", protect, getConversations);
conversationRouter.patch("/:id/read", protect, markConversationAsRead);
conversationRouter.patch("/:id/status", protect, updateConversationStatus);
conversationRouter.patch("/:id/takeover", protect, takeoverConversation);
conversationRouter.patch("/:id/toggle-ai", protect, toggleAI);

export default conversationRouter;