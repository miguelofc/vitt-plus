import { Response } from "express";
import { AgendamentosService } from "../services/agendamentos.service";
import { AuthRequest } from "../types/auth-request";

const agendamentosService = new AgendamentosService();

export class AgendamentosController {
  async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autorizado." });
      }

      const { medico, data, horario } = req.body;

      if (!medico || !data || !horario) {
        return res.status(400).json({
          message: "Campos medico, data e horario são obrigatórios."
        });
      }

      const agendamento = await agendamentosService.create(req.user.uid, {
        medico,
        data,
        horario
      });

      return res.status(201).json(agendamento);
    } catch (error: any) {
      console.error("Erro ao criar agendamento:", error);
      return res
        .status(400)
        .json({ message: error.message || "Erro ao criar agendamento." });
    }
  }

  async list(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autorizado." });
      }

      const agendamentos = await agendamentosService.listByUser(req.user.uid);
      return res.json(agendamentos);
    } catch (error: any) {
      console.error("Erro ao listar agendamentos:", error);
      return res
        .status(400)
        .json({ message: error.message || "Erro ao listar agendamentos." });
    }
  }

  async remove(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autorizado." });
      }

      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Id é obrigatório." });
      }

      await agendamentosService.remove(req.user.uid, id);

      return res.status(204).send();
    } catch (error: any) {
      console.error("Erro ao excluir agendamento:", error);
      return res
        .status(400)
        .json({ message: error.message || "Erro ao excluir agendamento." });
    }
  }
}