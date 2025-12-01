import { firestore } from "../config/firebase";
import { v4 as uuidv4 } from "uuid";

interface CreateRoomOutput {
  roomId: string;
}

export class ChamadasService {
  private collectionName = "rooms";

  async createRoom(userId: string): Promise<CreateRoomOutput> {
    const roomId = uuidv4();

    await firestore.collection(this.collectionName).doc(roomId).set({
      roomId,
      ownerId: userId,
      createdAt: new Date().toISOString()
    });

    return { roomId };
  }

  async joinRoom(userId: string, roomId: string): Promise<void> {
    const docRef = firestore.collection(this.collectionName).doc(roomId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error("Sala não encontrada.");
    }

    const participantsRef = docRef.collection("participants").doc(userId);

    await participantsRef.set({
      userId,
      joinedAt: new Date().toISOString()
    });
  }
}
