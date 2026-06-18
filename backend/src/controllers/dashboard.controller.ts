import { Request, Response } from "express";
import { db } from "../config/db";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [[employeesResult]]: any = await db.query(
      "SELECT COUNT(*) AS total FROM employees",
    );

    const [[coursesResult]]: any = await db.query(
      "SELECT COUNT(*) AS total FROM courses",
    );

    const [[internalTrainingResult]]: any = await db.query(
      "SELECT COUNT(*) AS total FROM internal_training",
    );

    const [[externalTrainingResult]]: any = await db.query(
      "SELECT COUNT(*) AS total FROM external_training",
    );

    res.json({
      employees: employeesResult.total,
      courses: coursesResult.total,
      internalTraining: internalTrainingResult.total,
      externalTraining: externalTrainingResult.total,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error fetching dashboard stats",
    });
  }
};

export const getRecentEmployees = async (req: Request, res: Response) => {
  try {
    const [employees]: any = await db.query(`
      SELECT
        id,
        employee_code,
        full_name,
        position,
        department,
        hire_date
      FROM employees
      WHERE hire_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      ORDER BY hire_date DESC
      LIMIT 5
    `);

    res.json(employees);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error fetching recent employees",
    });
  }
};

export const getEmployeesByWorkCenter = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(`
      SELECT
        COALESCE(department, 'No Work Center') AS workCenter,
        COUNT(*) AS total
      FROM employees
      GROUP BY department
      ORDER BY total DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error fetching employees by work center",
    });
  }
};

export const getEmployeesByCompany = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(`
      SELECT
        COALESCE(company, 'No Company') AS company,
        COUNT(*) AS total
      FROM employees
      GROUP BY company
      ORDER BY total DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error fetching employees by company",
    });
  }
};
