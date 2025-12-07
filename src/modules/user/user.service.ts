import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, role, phone FROM users`
  );
  return result.rows;
};

export const userServices = {
  getAllUsers,
};
