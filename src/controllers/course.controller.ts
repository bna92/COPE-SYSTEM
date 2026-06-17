import { Request, Response } from "express";
import { db } from "../config/db";

export const getCourses = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM courses");
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

