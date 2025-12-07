import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.route";
import { bookingRoutes } from "./modules/booking/booking.route";
import { userRoutes } from "./modules/user/user.route";
import { vehicleRoutes } from "./modules/vehicle/vehicle.route";

const app = express();

// parser
app.use(express.json());
// app.use(express.urlencoded());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);

// initializing DB
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to AutoRentz!");
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found!",
    path: req.path,
  });
});

export default app;
