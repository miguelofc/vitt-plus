import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import agendamentosRoutes from "./routes/agendamentos.routes";
import chamadasRoutes from "./routes/chamadas.routes";

const app = express();

app.use(cors({
  origin: [
      "http://localhost:4200",
      "http://192.168.1.3:4200" // 👈 AUTORIZA CELULAR NA REDE LOCAL
  ],
  credentials: true
}));

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "vitta-plus-backend" });
});

app.use("/auth", authRoutes);
app.use("/agendamentos", agendamentosRoutes);
app.use("/chamadas", chamadasRoutes);

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Erro interno:", err);
    res.status(500).json({
      message: "Erro interno. Tente novamente."
    });
  }
);

export default app;