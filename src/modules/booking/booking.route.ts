import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingControllers } from "./booking.controller";

const router = Router();

router.post("/", auth("admin", "customer"), bookingControllers.createBooking);
router.get("/", auth("admin", "customer"), bookingControllers.getAllBookings);

export const bookingRoutes = router;
