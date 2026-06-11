import { Request, Response } from "express";
import { db } from "../config/db";

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM employees");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener empleados", error });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const {
      employee_code,
      full_name,
      profession,
      position,
      department,
      company,
      birth_date,
      hire_date,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO employees 
      (employee_code, full_name, profession, position, department, company, birth_date, hire_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employee_code,
        full_name,
        profession,
        position,
        department,
        company,
        birth_date,
        hire_date,
      ]
    );

    res.status(201).json({
      message: "Empleado creado correctamente",
      result,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear empleado", error });
  }
};