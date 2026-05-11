import { Router } from "express";
import {
    saveCustomerMessage,
    saveAgentReply,
} from "../controllers/n8nController.js";

const n8nRouter = Router();

n8nRouter.post("/customer-message", saveCustomerMessage);
n8nRouter.post("/agent-reply", saveAgentReply);

export default n8nRouter;