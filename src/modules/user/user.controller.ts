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

const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing user information",
      });
    }

    const result = await userServices.updateUser(
      req.body,
      req.params.userId!,
      req.user.role
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.userId!);

    return res.status(result.status).json({
      success: result.success,
      message: result.message,
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
  updateUser,
  deleteUser,
};
