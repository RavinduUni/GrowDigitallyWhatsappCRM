import { Router } from "express";
import { getMessagesByConversation } from "../controllers/messageController.js";

const messageRouter = Router();

messageRouter.get("/:conversationId", getMessagesByConversation);

export default messageRouter;