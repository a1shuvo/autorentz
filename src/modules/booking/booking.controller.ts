import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBooking(req.body);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create booking",
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing user information",
      });
    }

    const result = await bookingServices.getAllBookings(req.user);

    const message =
      req.user.role === "admin"
        ? "Bookings retrieved successfully"
        : "Your bookings retrieved successfully";

    return res.status(200).json({
      success: true,
      message,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: error.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getAllBookings,
};
