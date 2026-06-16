import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { db } from "../config/db";

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

    const doc = new PDFDocument({ margin: 50 });

    const fileName = `${employee.full_name.replace(/\s+/g, "_")}_CV.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);

    doc.pipe(res);

    doc.fontSize(20).text("Curriculum Vitae", { align: "center" });
    doc.moveDown();

    doc.fontSize(16).text(employee.full_name);
    doc.fontSize(11).text(`ID: ${employee.employee_code}`);
    doc.text(`Puesto: ${employee.position || ""}`);
    doc.text(`Profesión: ${employee.profession || ""}`);
    doc.text(`Empresa: ${employee.company || ""}`);
    doc.text(`Departamento: ${employee.department || ""}`);
    doc.moveDown();

    doc.fontSize(14).text("Datos Generales", { underline: true });
    doc.fontSize(11);
    doc.text(`CURP: ${employee.curp || ""}`);
    doc.text(`RFC: ${employee.rfc || ""}`);
    doc.text(`NSS: ${employee.social_security_number || ""}`);
    doc.text(`Teléfono: ${employee.phone || ""}`);
    doc.text(`Domicilio: ${employee.address || ""}`);
    doc.moveDown();

    doc.fontSize(14).text("Experiencia Relevante", { underline: true });
    doc.fontSize(11);
    relevantExperience.forEach((item: any) => {
      doc.text(`• ${item.description}`);
    });
    doc.moveDown();

    doc.fontSize(14).text("Capacitación Interna", { underline: true });
    doc.fontSize(11);
    internalTraining.forEach((item: any) => {
      doc.text(
        `• ${item.course_code || ""} - ${item.course_name || ""} | Fecha inicial: ${item.initial_date ? item.initial_date.toISOString().split("T")[0] : ""} | Refrendo: ${item.latest_renewal_date ? item.latest_renewal_date.toISOString().split("T")[0] : ""}`
      );
    });
    doc.moveDown();

    doc.fontSize(14).text("Capacitación Externa", { underline: true });
    doc.fontSize(11);
    externalTraining.forEach((item: any) => {
      doc.text(
        `• ${item.course_name} - ${item.training_provider || ""} (${item.training_date || ""})`
      );
    });
    doc.moveDown();

    doc.fontSize(14).text("Experiencia Laboral", { underline: true });
    doc.fontSize(11);
    workExperience.forEach((work: any) => {
      doc.text(`${work.period || ""} | ${work.company || ""} | ${work.position || ""}`, {
        continued: false,
      });

      work.activities.forEach((act: any) => {
        doc.text(`   - ${act.activity}`);
      });

      doc.moveDown(0.5);
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