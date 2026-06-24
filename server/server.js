import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import doctorRoutes from "./routes/doctors.js";
import appointmentRoutes from "./routes/appointments.js";
import newsRoutes from "./routes/news.js";
import serviceRoutes from "./routes/services.js";
import contactRoutes from "./routes/contact.js";

dotenv.config({ path: ".env" });
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/contact", contactRoutes);
app.get("/", (req, res) => {
  res.send("Medicore API is running...");
});

const PORT = process.env.PORT || 5000;
// 404 handler — catches unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler — catches any unhandled errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal server error" });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
