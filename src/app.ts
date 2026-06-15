import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employee.routes";
import courseRoutes from "./routes/course.routes";
import internalTrainingRoutes from "./routes/internalTraining.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/employees", employeeRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/internal-training", internalTrainingRoutes);

export default app;