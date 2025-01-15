import { Router } from "express";
import { chatWithGemini } from "../controllers/gemini.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/chat").post(verifyJWT, chatWithGemini);

export default router;
