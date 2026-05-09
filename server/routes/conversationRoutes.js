import { Router } from "express";
import { getConversations } from "../controllers/conversationController.js";

const conversationRouter = Router();

conversationRouter.get("/", getConversations);

export default conversationRouter;