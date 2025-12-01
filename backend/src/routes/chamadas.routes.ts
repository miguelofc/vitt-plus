import { Router } from "express";
import { ChamadasController } from "../controllers/chamadas.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new ChamadasController();

router.use(authMiddleware);

router.post("/create", (req, res) => controller.create(req, res));
router.post("/join", (req, res) => controller.join(req, res));

export default router;
