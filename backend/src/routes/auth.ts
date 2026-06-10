import { Router } from "express";
import { login, signup , fetchMe } from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", fetchMe);
export default router;
