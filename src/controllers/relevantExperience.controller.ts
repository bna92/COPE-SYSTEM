import { Request, Response } from "express";
import { db } from "../config/db";

export const getRelevantExperiences = async (
  req: Request,
  res: Response
) => {
  try {
    const [rows] = await db.query(`
      SELECT
        re.id,
        e.employee_code,
        e.full_name,
        re.description,
        re.order_number
      FROM relevant_experience re
      JOIN employees e ON re.employee_id = e.id
      ORDER BY e.id, re.order_number
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener experiencia relevante",
      error,
    });
  }
};

export const createRelevantExperience = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      employee_id,
      description,
      order_number,
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO relevant_experience
      (
        employee_id,
        description,
        order_number
      )
      VALUES (?, ?, ?)
      `,
      [
        employee_id,
        description,
        order_number,
      ]
    );

    res.status(201).json({
      message: "Experiencia relevante creada correctamente",
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear experiencia relevante",
      error,
    });
  }
};