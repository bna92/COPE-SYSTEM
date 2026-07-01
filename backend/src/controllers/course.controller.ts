import { Request, Response } from "express";
import { db } from "../config/db";

export const getCourses = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT
        c.id,
        c.course_code,
        c.course_name,
        c.course_revision,
        c.created_at,
        c.excel_course_id,
        COUNT(DISTINCT it.employee_id) AS trained_employees
      FROM courses c
      LEFT JOIN internal_training it
        ON it.course_id = c.id
      GROUP BY
        c.id,
        c.course_code,
        c.course_name,
        c.course_revision,
        c.created_at,
        c.excel_course_id
      ORDER BY c.course_code ASC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener cursos", error });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { course_code, course_name, course_revision } = req.body;

    const [result] = await db.query(
      `INSERT INTO courses (course_code, course_name, course_revision)
       VALUES (?, ?, ?)`,
      [course_code, course_name, course_revision],
    );

    res.status(201).json({
      message: "Curso creado correctamente",
      result,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear curso", error });
  }
};


export const getCourseEmployees = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [rows]: any = await db.query(
      `
      SELECT
        e.id,
        e.employee_code,
        e.full_name,
        e.company,
        e.department AS work_center,
        it.initial_date,
        DATE_ADD(it.initial_date, INTERVAL 3 YEAR) AS next_renewal
      FROM internal_training it
      INNER JOIN employees e ON e.id = it.employee_id
      WHERE it.course_id = ?
      ORDER BY e.full_name ASC
      `,
      [id],
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener empleados del curso",
      error,
    });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [rows]: any = await db.query(
      `
      SELECT
        id,
        course_code,
        course_name,
        course_revision
      FROM courses
      WHERE id = ?
      `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Curso no encontrado",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener curso",
      error,
    });
  }
};
