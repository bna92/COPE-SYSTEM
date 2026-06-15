import { Request, Response } from "express";
import { db } from "../config/db";

export const getWorkExperienceActivities = async (
  req: Request,
  res: Response
) => {
  try {
    const [rows] = await db.query(`
      SELECT
        wea.id,
        wea.work_experience_id,
        e.full_name,
        we.company,
        we.position,
        wea.activity,
        wea.order_number
      FROM work_experience_activities wea
      JOIN work_experience we ON wea.work_experience_id = we.id
      JOIN employees e ON we.employee_id = e.id
      ORDER BY wea.work_experience_id, wea.order_number
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener actividades laborales",
      error,
    });
  }
};

export const createWorkExperienceActivity = async (
  req: Request,
  res: Response
) => {
  try {
    const { work_experience_id, activity, order_number } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO work_experience_activities (
        work_experience_id,
        activity,
        order_number
      )
      VALUES (?, ?, ?)
      `,
      [work_experience_id, activity, order_number]
    );

    res.status(201).json({
      message: "Actividad laboral creada correctamente",
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear actividad laboral",
      error,
    });
  }
};