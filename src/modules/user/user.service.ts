import { pool } from "../../config/db";
import { IUser } from "../auth/auth.service";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, role, phone FROM users`
  );
  return result.rows;
};

const updateUser = async (user: IUser, userId: string, userRole: string) => {
  const { name, email, role, phone } = user;
  if (userRole === "admin") {
    const result = await pool.query(
      `UPDATE users SET name=COALESCE($1, name), email=COALESCE($2, email), role=COALESCE($3, role), phone=COALESCE($4, phone) WHERE id=$5 RETURNING id, name, email, role, phone`,
      [name, email, role, phone, userId]
    );
    return result.rows[0];
  } else {
    const result = await pool.query(
      `UPDATE users SET name=COALESCE($1, name), phone=COALESCE($2, phone) WHERE id=$3 RETURNING id, name, email, role, phone`,
      [name, phone, userId]
    );
    return result.rows[0];
  }
};

export const userServices = {
  getAllUsers,
  updateUser,
};
