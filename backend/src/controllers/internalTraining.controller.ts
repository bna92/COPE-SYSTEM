import { Request, Response } from "express";
import { db } from "../config/db";

export const getInternalTraining = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        it.id,
        e.employee_code,
        e.full_name,
        c.course_code,
        c.course_name,
        it.initial_date,
        it.latest_renewal_date
      FROM internal_training it
      JOIN employees e ON it.employee_id = e.id
      LEFT JOIN courses c ON it.course_id = c.id
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener capacitaciones internas", error });
  }
};

export const createInternalTraining = async (req: Request, res: Response) => {
  try {
    const {
      employee_id,
      course_id,
      course_code,
      course_name,
      initial_date,
      latest_renewal_date,
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO internal_training (
        employee_id,
        course_id,
        course_code,
        course_name,
        initial_date,
        latest_renewal_date
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        employee_id,
        course_id,
        course_code,
        course_name,
        initial_date,
        latest_renewal_date,
      ]
    );

    res.status(201).json({
      message: "Capacitación interna creada correctamente",
      result,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear capacitación interna", error });
  }
};