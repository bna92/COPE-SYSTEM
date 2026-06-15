import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employee.routes";
import courseRoutes from "./routes/course.routes";
import internalTrainingRoutes from "./routes/internalTraining.routes";
import externalTrainingRoutes from "./routes/externalTraining.routes";
import relevantExperienceRoutes from "./routes/workExperience.routes";
import workExperienceRoutes from "./routes/workExperience.routes"
import workExperienceActivityRoutes from "./routes/workExperienceActivity.routes";
import cvRoutes from "./routes/cv.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/employees", employeeRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/internal-training", internalTrainingRoutes);
app.use("/api/external-training", externalTrainingRoutes);
app.use("/api/relevant-experience", relevantExperienceRoutes);
app.use("/api/work-experience", workExperienceRoutes);
app.use("/api/work-experience-activities", workExperienceActivityRoutes);
app.use("/api", cvRoutes);

export default app;