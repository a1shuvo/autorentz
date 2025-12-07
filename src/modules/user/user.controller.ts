import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers();

    if (!result.length) {
      return res.status(200).json({
        success: true,
        message: "No users found",
        data: result,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      errors: error.message,
    });
  }
};

export const userControllers = {
  getAllUsers,
};
