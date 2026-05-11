import { Router } from "express";
import {
    getMessagesByConversation,
    sendManualMessage,
} from "../controllers/messageController.js";
import { protect } from "../middlewares/authMiddleware.js";

const messageRouter = Router();

messageRouter.post("/send", protect, sendManualMessage);
messageRouter.get("/:conversationId", protect, getMessagesByConversation);

export default messageRouter;