import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingControllers } from "./booking.controller";

const router = Router();

router.post("/", auth("admin", "customer"), bookingControllers.createBooking);

export const bookingRoutes = router;
