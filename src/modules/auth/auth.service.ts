import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const signUp = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role = "customer" } = payload;

  const hashedPassword = await bcrypt.hash(password as string, 12);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPassword, phone, role]
  );
  return result;
};

const signIn = async () => {};

export const authServices = {
  signUp,
  signIn,
};
