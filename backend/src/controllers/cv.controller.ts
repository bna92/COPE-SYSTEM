import { Request, Response } from "express";
import { db } from "../config/db";

export const getEmployeeCV = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [employeeRows]: any = await db.query(
      "SELECT * FROM employees WHERE id = ?",
      [id]
    );

    if (employeeRows.length === 0) {
      return res.status(404).json({
        message: "Empleado no encontrado",
      });
    }

    const employee = employeeRows[0];

    const [relevantExperience]: any = await db.query(
      `
      SELECT description, order_number
      FROM relevant_experience
      WHERE employee_id = ?
      ORDER BY order_number
      `,
      [id]
    );

    const [internalTraining]: any = await db.query(
      `
      SELECT 
        it.id,
        c.course_code,
        c.course_name,
        it.initial_date,
        it.latest_renewal_date
      FROM internal_training it
      LEFT JOIN courses c ON it.course_id = c.id
      WHERE it.employee_id = ?
      ORDER BY it.initial_date DESC
      `,
      [id]
    );

    const [externalTraining]: any = await db.query(
      `
      SELECT course_name, training_provider, training_date
      FROM external_training
      WHERE employee_id = ?
      `,
      [id]
    );

    const [workExperienceRows]: any = await db.query(
      `
      SELECT id, period, company, position
      FROM work_experience
      WHERE employee_id = ?
      ORDER BY id
      `,
      [id]
    );

    for (const work of workExperienceRows) {
      const [activities]: any = await db.query(
        `
        SELECT activity, order_number
        FROM work_experience_activities
        WHERE work_experience_id = ?
        ORDER BY order_number
        `,
        [work.id]
      );

      work.activities = activities;
    }

    res.json({
      employee,
      relevantExperience,
      internalTraining,
      externalTraining,
      workExperience: workExperienceRows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al generar información del CV",
      error,
    });
  }
};