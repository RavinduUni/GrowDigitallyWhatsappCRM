import { Router } from "express";
import { getWebhook } from "../controllers/n8nController.js";

const n8nRouter = Router();

n8nRouter.post("/webhook", getWebhook);

export default n8nRouter;
    