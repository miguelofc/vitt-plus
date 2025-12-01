import { firestore } from "../config/firebase";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  private collection = "users";

  // =============================
  // REGISTER
  // =============================
  async register(email: string, password: string) {
    const snap = await firestore
      .collection(this.collection)
      .where("email", "==", email)
      .get();

    const hashed = await bcrypt.hash(password, 10);

    // Se já existe usuário com esse email
    if (!snap.empty) {
      const doc = snap.docs[0];
      const data = doc.data() as any;

      // Se já tem senha, não deixa cadastrar de novo
      if (data.password) {
        throw new Error("Email já cadastrado.");
      }

      // Se NÃO tem senha (caso do seu usuário atual), atualiza o doc com a senha
      await doc.ref.update({
        password: hashed,
        updatedAt: new Date().toISOString(),
      });

      return { id: doc.id, email: data.email || email };
    }

    // Se não existe, cria do zero
    const ref = await firestore.collection(this.collection).add({
      email,
      password: hashed,
      createdAt: new Date().toISOString(),
    });

    return { id: ref.id, email };
  }

  // =============================
  // LOGIN
  // =============================
  async login(email: string, password: string) {
    const snap = await firestore
      .collection(this.collection)
      .where("email", "==", email)
      .get();

    if (snap.empty) {
      throw new Error("Usuário não encontrado.");
    }

    const user = snap.docs[0];
    const data = user.data() as any;

    const hash = data.password as string | undefined;

    // ⚠️ Aqui era onde quebrava: data.password estava undefined
    if (!hash) {
      throw new Error(
        "Usuário sem senha cadastrada. Faça o cadastro novamente."
      );
    }

    const match = await bcrypt.compare(password, hash);
    if (!match) {
      throw new Error("Senha incorreta.");
    }

    const token = jwt.sign(
      {
        uid: user.id,
        email: data.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "2d" }
    );

    return {
      token,
      userId: user.id,
      email: data.email,
    };
  }
}