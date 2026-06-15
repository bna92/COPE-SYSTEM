import { Request, Response } from "express";
import { db } from "../config/db";

export const getExternalTraining = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        et.id,
        e.employee_code,
        e.full_name,
        et.course_name,
        et.training_provider,
        et.training_date
      FROM external_training et
      JOIN employees e ON et.employee_id = e.id
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener capacitaciones externas", error });
  }
};

export const createExternalTraining = async (req: Request, res: Response) => {
  try {
    const { employee_id, course_name, training_provider, training_date } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO external_training (
        employee_id,
        course_name,
        training_provider,
        training_date
      )
      VALUES (?, ?, ?, ?)
      `,
      [employee_id, course_name, training_provider, training_date]
    );

    res.status(201).json({
      message: "Capacitación externa creada correctamente",
      result,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear capacitación externa", error });
  }
};