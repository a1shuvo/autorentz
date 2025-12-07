import { Router } from "express";
import auth from "../../middleware/auth";
import { userControllers } from "./user.controller";

const router = Router();

router.get("/", auth("admin"), userControllers.getAllUsers);
router.put("/:userId", auth("admin", "customer"), userControllers.updateUser);

export const userRoutes = router;
