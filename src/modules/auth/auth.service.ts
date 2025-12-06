import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

interface IUser {
  id?: number;
  name?: string;
  email: string;
  password: string;
  phone?: string;
  role?: "admin" | "customer";
}

const signUp = async (user: IUser) => {
  const { name, email, password, phone, role = "customer" } = user;

  // check if user already exists
  const existingUser = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email.toLowerCase()]
  );
  if (existingUser.rows.length > 0) {
    throw new Error("Email already registered");
  }

  // check if password is 6 character long or not
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const hashedPassword = await bcrypt.hash(password as string, 12);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`,
    [name, email.toLowerCase(), hashedPassword, phone, role]
  );

  return result.rows[0];
};

const signIn = async () => {};

export const authServices = {
  signUp,
  signIn,
};
