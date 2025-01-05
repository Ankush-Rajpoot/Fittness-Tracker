import { Router } from "express";
import { chatWithGPT } from "../controllers/openai.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/chat").post(verifyJWT, chatWithGPT);

export default router;
