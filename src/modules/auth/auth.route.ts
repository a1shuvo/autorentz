import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router();

router.post("/signup", authControllers.signUp);
router.post("/signin", authControllers.signIn);

export const authRoutes = router;
