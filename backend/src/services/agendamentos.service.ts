import { firestore } from "../config/firebase";

export interface AgendamentoInput {
  medico: string;
  data: string;
  horario: string;
}

export interface Agendamento extends AgendamentoInput {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
}

export class AgendamentosService {
  private collectionName = "agendamentos";

  async create(userId: string, body: AgendamentoInput): Promise<Agendamento> {
    const ref = await firestore.collection(this.collectionName).add({
      userId,
      medico: body.medico,
      data: body.data,
      horario: body.horario,
      status: "ativo",
      createdAt: new Date().toISOString()
    });

    const snapshot = await ref.get();
    const data = snapshot.data() as Omit<Agendamento, "id">;

    return {
      id: ref.id,
      ...data
    };
  }

  async listByUser(userId: string): Promise<Agendamento[]> {
    const snapshot = await firestore
      .collection(this.collectionName)
      .where("userId", "==", userId)
      .get();

    const items: Agendamento[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as Omit<Agendamento, "id">;

      items.push({
        id: doc.id,
        ...data
      });
    });

    // Ordenação manual (sem precisar índice no Firestore)
    items.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return items;
  }

  async remove(userId: string, id: string): Promise<void> {
    const docRef = firestore.collection(this.collectionName).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error("Agendamento não encontrado.");
    }

    const data = doc.data();
    if (!data || data.userId !== userId) {
      throw new Error("Você não tem permissão para excluir este agendamento.");
    }

    await docRef.delete();
  }
}