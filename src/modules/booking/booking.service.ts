import { pool } from "../../config/db";

interface IBooking {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

interface IBookingStatus {
  status: "cancelled" | "returned";
}

const createBooking = async (payload: IBooking) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  // fetch vehicle info
  const vehicleResult = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicle_id,
  ]);

  if (vehicleResult.rowCount === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleResult.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  // calculate total price
  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (days <= 0) {
    throw new Error("Invalid date range");
  }

  const totalPrice = vehicle.daily_rent_price * days;

  // insert booking
  const bookingResult = await pool.query(
    `INSERT INTO bookings 
       (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  // change vehicle available status
  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  return {
    ...bookingResult.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const getAllBookings = async (user: Record<string, unknown>) => {
  if (user.role === "admin") {
    const result = await pool.query(
      `SELECT b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
        json_build_object(
          'name', u.name,
          'email', u.email
        ) AS customer,
        json_build_object(
          'vehicle_name', v.vehicle_name,
          'registration_number', v.registration_number
        ) AS vehicle
      FROM bookings b
      LEFT JOIN users u ON b.customer_id = u.id
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.rent_start_date DESC`
    );

    return result.rows;
  } else {
    const result = await pool.query(
      `SELECT b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
        json_build_object(
          'vehicle_name', v.vehicle_name,
          'registration_number', v.registration_number,
          'type', v.type
        ) AS vehicle
      FROM bookings b
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
      ORDER BY b.rent_start_date DESC
      `,
      [user.id]
    );

    return result.rows;
  }
};

const updateBooking = async (
  bookingId: string,
  user: Record<string, unknown>,
  bookingStatus: IBookingStatus
) => {
  const now = new Date();

  // system auto return
  if (!user) {
    const expired = await pool.query(
      `SELECT * FROM bookings WHERE status='active' AND rent_end_date < $1`,
      [now]
    );

    for (const b of expired.rows) {
      await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1`, [
        b.id,
      ]);
      await pool.query(
        `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
        [b.vehicle_id]
      );
    }

    return { autoReturned: expired.rows.length };
  }

  // user update
  if (!bookingId || !bookingStatus)
    throw new Error("Booking ID and status are required");

  const bookingResult = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);
  if (bookingResult.rowCount === 0) throw new Error("Booking not found");

  const booking = bookingResult.rows[0];

  // role-based rules
  if (user.role === "customer") {
    if (bookingStatus.status !== "cancelled")
      throw new Error("Customers can only cancel");
    if (booking.customer_id !== user.id)
      throw new Error("Cannot cancel others bookings");

    const rentStart = new Date(booking.rent_start_date);
    if (now >= rentStart) throw new Error("Cannot cancel after start date");
  }

  if (booking.status !== "active")
    throw new Error("Only active bookings can be updated");

  // Update booking
  const updated = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [bookingStatus.status, bookingId]
  );

  // Update vehicle availability
  if (
    bookingStatus.status === "cancelled" ||
    bookingStatus.status === "returned"
  ) {
    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [booking.vehicle_id]
    );
  }

  return updated.rows[0];
};

export const bookingServices = {
  createBooking,
  getAllBookings,
  updateBooking,
};
