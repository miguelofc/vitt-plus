import { Response } from "express";
import { ChamadasService } from "../services/chamadas.service";
import { AuthRequest } from "../types/auth-request";

const chamadasService = new ChamadasService();

export class ChamadasController {
  async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autorizado." });
      }

      const result = await chamadasService.createRoom(req.user.uid);
      return res.status(201).json(result);
    } catch (error: any) {
      console.error("Erro ao criar sala:", error);
      return res
        .status(400)
        .json({ message: error.message || "Erro ao criar sala." });
    }
  }

  async join(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autorizado." });
      }

      const { roomId } = req.body;

      if (!roomId) {
        return res.status(400).json({ message: "roomId é obrigatório." });
      }

      await chamadasService.joinRoom(req.user.uid, roomId);

      return res.json({ message: "Entrou na sala com sucesso." });
    } catch (error: any) {
      console.error("Erro ao entrar na sala:", error);
      return res
        .status(400)
        .json({ message: error.message || "Erro ao entrar na sala." });
    }
  }
}
