import { Request, Response } from "express";
import xlsx from "xlsx";
import { db } from "../config/db";

const cleanText = (value: any) => {
  if (value === undefined || value === null) return "";
  return String(value).replace(/\s+/g, " ").trim();
};

const excelDateToJSDate = (serial: any) => {
  if (!serial || isNaN(Number(serial))) return null;

  const excelEpoch = new Date(1899, 11, 30);
  const date = new Date(excelEpoch.getTime() + Number(serial) * 86400000);

  return date.toISOString().split("T")[0];
};

export const importCopeExcel = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No se recibió ningún archivo",
      });
    }

    const workbook = xlsx.readFile(req.file.path);

    const datosSheet = workbook.Sheets["Datos"];

    if (!datosSheet) {
      return res.status(400).json({
        message: "No se encontró la hoja Datos",
      });
    }

    const datosRows: any[] = xlsx.utils.sheet_to_json(datosSheet, {
      defval: "",
    });

    let inserted = 0;
    let skipped = 0;

    for (const row of datosRows) {
      const employee_code = cleanText(row["IDEmpleado"]);

      if (!employee_code || employee_code === "#") {
        skipped++;
        continue;
      }

      const first_name = cleanText(row["Nombre del colaborador"]);
      const last_name = cleanText(row["Apellidos"]);

      if (!first_name || !last_name) {
        skipped++;
        continue;
      }

      const curp = cleanText(row["CURP"]);
      const rfc = cleanText(row["RFC"]);
      const social_security_number = cleanText(
        row["Número \r\nSeguridad Social"],
      );
      const birth_date = excelDateToJSDate(row["Fecha de nacimiento"]);
      const gender = cleanText(row["Genero"]);
      const marital_status = cleanText(row["Estado Civil "]);
      const address = cleanText(row["Domicilio Particular"]);
      const phone = cleanText(row["Número \r\nde teléfono"]);
      const professional_license = cleanText(row["Cedula Profesional"]);
      const profession = cleanText(row["Profesión"]);
      const position = cleanText(row["Puesto"]);
      const department = cleanText(row["Centro de Trabajo"]);
      const company = employee_code.includes("-CS")
        ? "Caribbean Supervision"
        : "Oil Test International";
      const hire_date = excelDateToJSDate(row["Fecha de \r\ncontratación"]);

      await db.query(
        `
        INSERT INTO employees (
          employee_code,
          first_name,
          last_name,
          curp,
          rfc,
          social_security_number,
          birth_date,
          gender,
          marital_status,
          address,
          phone,
          professional_license,
          profession,
          position,
          department,
          company,
          hire_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          first_name = VALUES(first_name),
          last_name = VALUES(last_name),
          curp = VALUES(curp),
          rfc = VALUES(rfc),
          social_security_number = VALUES(social_security_number),
          birth_date = VALUES(birth_date),
          gender = VALUES(gender),
          marital_status = VALUES(marital_status),
          address = VALUES(address),
          phone = VALUES(phone),
          professional_license = VALUES(professional_license),
          profession = VALUES(profession),
          position = VALUES(position),
          department = VALUES(department),
          company = VALUES(company),
          hire_date = VALUES(hire_date)
        `,
        [
          employee_code,
          first_name,
          last_name,
          curp,
          rfc,
          social_security_number,
          birth_date,
          gender,
          marital_status,
          address,
          phone,
          professional_license,
          profession,
          position,
          department,
          company,
          hire_date,
        ],
      );

      inserted++;
    }

    res.json({
      message: "Importación de empleados completada",
      totalRows: datosRows.length,
      insertedOrUpdated: inserted,
      skipped,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al importar empleados del COPE",
      error,
    });
  }
};

export const importCopeCourses = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No se recibió ningún archivo",
      });
    }

    const workbook = xlsx.readFile(req.file.path);

    const cursosSheet = workbook.Sheets["Cursos"];

    if (!cursosSheet) {
      return res.status(400).json({
        message: "No se encontró la hoja Cursos",
      });
    }

    const cursosRows: any[] = xlsx.utils.sheet_to_json(cursosSheet, {
      defval: "",
    });

    let insertedOrUpdated = 0;
    let skipped = 0;

    for (const row of cursosRows) {
      const course_code = cleanText(row["Codigo"]);
      const course_name = cleanText(row["Nombre del curso"]);
      const excel_course_id = Number(row["ID Curso"]);

      if (!course_code || !course_name || !excel_course_id) {
        skipped++;
        continue;
      }

      await db.query(
        `
        INSERT INTO courses (
          excel_course_id,
          course_code,
          course_name
        )
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          course_code = VALUES(course_code),
          course_name = VALUES(course_name)
        `,
        [excel_course_id, course_code, course_name],
      );

      insertedOrUpdated++;
    }

    res.json({
      message: "Importación de cursos completada",
      totalRows: cursosRows.length,
      insertedOrUpdated,
      skipped,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al importar cursos del COPE",
      error,
    });
  }
};

export const importCopeInternalTraining = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No se recibió ningún archivo",
      });
    }

    const workbook = xlsx.readFile(req.file.path);

    const trainingSheet = workbook.Sheets["CapacitacionE-Learning"];

    if (!trainingSheet) {
      return res.status(400).json({
        message: "No se encontró la hoja CapacitacionE-Learning",
      });
    }

    const trainingRows: any[] = xlsx.utils.sheet_to_json(trainingSheet, {
      defval: "",
    });

    let inserted = 0;
    let skipped = 0;

    const skippedRows: any[] = [];

    for (const row of trainingRows) {
      const employeeCode = cleanText(row["ID Colaborador"]);
      const courseCode = cleanText(row["Codigo"]);
      const courseName = cleanText(row["Nombre Curso"]);
      const excelCourseId = Number(row["ID Curso"]);
      const initialDate = excelDateToJSDate(row["Fecha Inicial"]);
      const latestRenewalDate = excelDateToJSDate(row["Refrendo mas reciente"]);

      if (!employeeCode || !courseCode || !excelCourseId) {
        skipped++;

        skippedRows.push({
          employeeCode,
          courseCode,
          excelCourseId,
          reason: "Datos incompletos",
        });

        continue;
      }

      const [employeeRows]: any = await db.query(
        "SELECT id FROM employees WHERE employee_code = ?",
        [employeeCode],
      );

      if (employeeRows.length === 0) {
        skipped++;

        skippedRows.push({
          employeeCode,
          courseCode,
          excelCourseId,
          reason: "Empleado no encontrado",
        });

        continue;
      }

      const employeeId = employeeRows[0].id;

      const [courseRows]: any = await db.query(
        "SELECT id FROM courses WHERE excel_course_id = ?",
        [excelCourseId],
      );

      if (courseRows.length === 0) {
        skipped++;

        skippedRows.push({
          employeeCode,
          courseCode,
          excelCourseId,
          reason: "Curso no encontrado",
        });

        continue;
      }
      const courseId = courseRows[0].id;

      await db.query(
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
          employeeId,
          courseId,
          courseCode,
          courseName,
          initialDate,
          latestRenewalDate,
        ],
      );

      inserted++;
    }

    res.json({
      message: "Importación de capacitación interna completada",
      totalRows: trainingRows.length,
      inserted,
      skipped,
      skippedRows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al importar capacitación interna del COPE",
      error,
    });
  }
};

export const previewCopeSheet = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No se recibió ningún archivo",
      });
    }

    const sheetName = req.params.sheetName as string;

    const workbook = xlsx.readFile(req.file.path);

    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      return res.status(400).json({
        message: `No se encontró la hoja ${sheetName}`,
        availableSheets: workbook.SheetNames,
      });
    }

    const rows = xlsx.utils.sheet_to_json(sheet, {
      defval: "",
    });

    res.json({
      sheetName,
      totalRows: rows.length,
      preview: rows.slice(0, 5),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al previsualizar hoja del COPE",
      error,
    });
  }
};
