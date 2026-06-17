import { useEffect, useState } from "react";
import { getEmployees } from "../services/employeeService";
import type { Employee } from "../types/employee";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) =>
    `${employee.employee_code}
     ${employee.full_name}
     ${employee.position}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return <h2>Cargando empleados...</h2>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>COPE System</h1>

      <input
        type="text"
        placeholder="Buscar empleado..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Puesto</th>
            <th>Empresa</th>
            <th>PDF</th>
          </tr>
        </thead>

        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.employee_code}</td>
              <td>{employee.full_name}</td>
              <td>{employee.position}</td>
              <td>{employee.company}</td>

              <td>
                <a
                  href={`http://localhost:4000/api/employees/${employee.id}/cv/pdf`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}