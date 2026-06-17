import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { db } from "../config/db";
import { formatDate } from "../utils/formatDate";

export const generateEmployeeCVPDF = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [employeeRows]: any = await db.query(
      "SELECT * FROM employees WHERE id = ?",
      [id]
    );

    if (employeeRows.length === 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    const employee = employeeRows[0];

    const [relevantExperience]: any = await db.query(
      `SELECT description FROM relevant_experience WHERE employee_id = ? ORDER BY order_number`,
      [id]
    );

    const [internalTraining]: any = await db.query(
      `
      SELECT c.course_code, c.course_name, it.initial_date, it.latest_renewal_date
      FROM internal_training it
      LEFT JOIN courses c ON it.course_id = c.id
      WHERE it.employee_id = ?
      ORDER BY it.initial_date DESC
      `,
      [id]
    );

    const [externalTraining]: any = await db.query(
      `SELECT course_name, training_provider, training_date FROM external_training WHERE employee_id = ?`,
      [id]
    );

    const [workExperience]: any = await db.query(
      `SELECT id, period, company, position FROM work_experience WHERE employee_id = ?`,
      [id]
    );

    for (const work of workExperience) {
      const [activities]: any = await db.query(
        `SELECT activity FROM work_experience_activities WHERE work_experience_id = ? ORDER BY order_number`,
        [work.id]
      );

      work.activities = activities;
    }

    const doc = new PDFDocument({
      size: "A4",
      margin: 45,
    });

    const fileName = `${employee.full_name.replace(/\s+/g, "_")}_CV.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);

    doc.pipe(res);

    const sectionTitle = (title: string) => {
      doc.moveDown(0.8);
      doc.fontSize(12).font("Helvetica-Bold").text(title.toUpperCase());
      doc.moveTo(45, doc.y + 3).lineTo(550, doc.y + 3).stroke();
      doc.moveDown(0.6);
      doc.font("Helvetica").fontSize(10);
    };

    doc.fontSize(10).font("Helvetica-Bold").text("OIL TEST INTERNATIONAL MEXICO", {
      align: "center",
    });

    doc.moveDown(0.3);

    doc.fontSize(16).text("CURRICULUM VITAE", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(14).font("Helvetica-Bold").text(employee.full_name, {
      align: "center",
    });

    doc.fontSize(10).font("Helvetica").text(`ID Colaborador: ${employee.employee_code}`, {
      align: "center",
    });

    sectionTitle("Datos Generales");

    doc.text(`Profesión: ${employee.profession || ""}`);
    doc.text(`Puesto: ${employee.position || ""}`);
    doc.text(`Departamento: ${employee.department || ""}`);
    doc.text(`Empresa: ${employee.company || ""}`);
    doc.text(`Fecha de ingreso: ${formatDate(employee.hire_date)}`);
    doc.text(`Fecha de nacimiento: ${formatDate(employee.birth_date)}`);
    doc.text(`CURP: ${employee.curp || ""}`);
    doc.text(`RFC: ${employee.rfc || ""}`);
    doc.text(`NSS: ${employee.social_security_number || ""}`);
    doc.text(`Cédula profesional: ${employee.professional_license || ""}`);

    sectionTitle("Experiencia Relevante");

    if (relevantExperience.length === 0) {
      doc.text("Sin información registrada.");
    } else {
      relevantExperience.forEach((item: any) => {
        doc.text(`• ${item.description}`, {
          indent: 10,
          paragraphGap: 4,
        });
      });
    }

    sectionTitle("Capacitación Interna / E-Learning");

    if (internalTraining.length === 0) {
      doc.text("Sin información registrada.");
    } else {
      internalTraining.forEach((item: any) => {
        doc.font("Helvetica-Bold").text(`${item.course_code || ""} - ${item.course_name || ""}`);
        doc.font("Helvetica").text(
          `Fecha inicial: ${formatDate(item.initial_date)} | Refrendo más reciente: ${formatDate(item.latest_renewal_date)}`
        );
        doc.moveDown(0.4);
      });
    }

    sectionTitle("Capacitación Externa");

    if (externalTraining.length === 0) {
      doc.text("Sin información registrada.");
    } else {
      externalTraining.forEach((item: any) => {
        doc.font("Helvetica-Bold").text(item.course_name || "");
        doc.font("Helvetica").text(
          `Agente capacitador: ${item.training_provider || ""} | Fecha: ${item.training_date || ""}`
        );
        doc.moveDown(0.4);
      });
    }

    sectionTitle("Experiencia Laboral");

    if (workExperience.length === 0) {
      doc.text("Sin información registrada.");
    } else {
      workExperience.forEach((work: any) => {
        doc.font("Helvetica-Bold").text(`${work.period || ""} | ${work.company || ""}`);
        doc.font("Helvetica").text(`Puesto: ${work.position || ""}`);

        work.activities.forEach((act: any) => {
          doc.text(`• ${act.activity}`, {
            indent: 15,
            paragraphGap: 3,
          });
        });

        doc.moveDown(0.6);
      });
    }

    doc.moveDown(2);

    doc.fontSize(8).text("COPE System | Versión de base de datos: BD 2026-1T | Generado automáticamente", {
      align: "center",
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al generar PDF del CV",
      error,
    });
  }
};