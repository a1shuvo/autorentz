import { Router } from "express";
import auth from "../../middleware/auth";
import { vehicleControllers } from "./vehicle.controller";

const router = Router();

router.post("/", auth("admin"), vehicleControllers.createVehicle);

export const vehicleRoutes = router;
