import jwt from "jsonwebtoken";
import config from "../config";

export const generateToken = (payload: Record<string, unknown>) => {
  return jwt.sign(payload, config.jwtSecret as string, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwtSecret as string);
};
