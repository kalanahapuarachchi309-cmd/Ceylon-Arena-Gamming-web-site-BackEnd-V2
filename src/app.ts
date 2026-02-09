import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/user.routes";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://ceylon-arena-gamming-web-site.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

export default app;
