import { Router } from "express";
import { getConversations, markConversationAsRead } from "../controllers/conversationController.js";

const conversationRouter = Router();

conversationRouter.get("/", getConversations);
conversationRouter.patch("/:id/read", markConversationAsRead);

export default conversationRouter;