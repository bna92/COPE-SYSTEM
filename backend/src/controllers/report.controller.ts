import { Request, Response } from "express";
import { db } from "../config/db";

export const getExpiredTraining = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(`
      SELECT
        e.employee_code,
        e.full_name,
        e.company,
        e.department AS work_center,
        it.course_code,
        it.course_name,
        COALESCE(it.latest_renewal_date, it.initial_date) AS base_date,
        DATE_ADD(COALESCE(it.latest_renewal_date, it.initial_date), INTERVAL 3 YEAR) AS expiration_date,
        DATEDIFF(
          CURDATE(),
          DATE_ADD(COALESCE(it.latest_renewal_date, it.initial_date), INTERVAL 3 YEAR)
        ) AS days_expired
      FROM internal_training it
      INNER JOIN employees e ON e.id = it.employee_id
      WHERE COALESCE(it.latest_renewal_date, it.initial_date) IS NOT NULL
        AND DATE_ADD(COALESCE(it.latest_renewal_date, it.initial_date), INTERVAL 3 YEAR) < CURDATE()
      ORDER BY expiration_date ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error fetching expired training report",
    });
  }
};