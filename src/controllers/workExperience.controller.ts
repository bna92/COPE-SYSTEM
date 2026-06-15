import { Request, Response } from "express";
import { db } from "../config/db";

export const getWorkExperiences = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT
        we.id,
        e.employee_code,
        e.full_name,
        we.period,
        we.company,
        we.position
      FROM work_experience we
      JOIN employees e ON we.employee_id = e.id
      ORDER BY e.id, we.id
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener experiencia laboral",
      error,
    });
  }
};

export const createWorkExperience = async (req: Request, res: Response) => {
  try {
    const { employee_id, period, company, position } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO work_experience (
        employee_id,
        period,
        company,
        position
      )
      VALUES (?, ?, ?, ?)
      `,
      [employee_id, period, company, position]
    );

    res.status(201).json({
      message: "Experiencia laboral creada correctamente",
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear experiencia laboral",
      error,
    });
  }
};