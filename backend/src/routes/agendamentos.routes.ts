import { Router } from "express";
import { AgendamentosController } from "../controllers/agendamentos.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new AgendamentosController();

router.use(authMiddleware);

router.get("/", (req, res) => controller.list(req, res));
router.post("/", (req, res) => controller.create(req, res));
router.delete("/:id", (req, res) => controller.remove(req, res));

export default router;