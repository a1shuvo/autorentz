import { pool } from "../../config/db";

interface IVehicle {
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: "available" | "booked";
}

const createVehicle = async (vehicle: IVehicle) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = vehicle;

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result.rows[0];
};

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result.rows;
};

const getVehicleById = async (vehicleId: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicleId,
  ]);
  return result.rows[0];
};

const updateVehicle = async (vehicle: IVehicle, vehicleId: string) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = vehicle;
  const result = await pool.query(
    `UPDATE vehicles SET vehicle_name = COALESCE($1, vehicle_name), type = COALESCE($2, type), registration_number = COALESCE($3, registration_number), daily_rent_price = COALESCE($4, daily_rent_price), availability_status = COALESCE($5, availability_status) WHERE id=$6 RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      vehicleId,
    ]
  );
  return result.rows[0];
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
};
