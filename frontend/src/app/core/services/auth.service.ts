import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastService } from "./toast.service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  private tokenKey = "vitta_token";
  private backend = environment.backendUrl;

  constructor(
    private router: Router,
    private toast: ToastService,
  ) {}

  // =========================================================
  // LOGIN (FUNCIONANDO)
  // =========================================================
  async login(email: string, password: string) {
    try {
      const res = await fetch(`${this.backend}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        this.toast.error(data.message || "Erro ao fazer login.");
        return;
      }

      // Salva token JWT do backend
      localStorage.setItem(this.tokenKey, data.token);

      this.toast.success("Login realizado com sucesso!");
      this.router.navigate(["/app"]);
    } catch (err) {
      this.toast.error("Erro inesperado no login.");
    }
  }

  // =========================================================
  // REGISTER (RESTAURADO)
  // =========================================================
  async register(name: string, email: string, password: string) {
    try {
      const res = await fetch(`${this.backend}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        this.toast.error(data.message || "Erro ao registrar.");
        return;
      }

      this.toast.success("Conta criada com sucesso!");
      this.router.navigate(["/auth/login"]);
    } catch (err) {
      this.toast.error("Erro inesperado no cadastro.");
    }
  }

  // =========================================================
  // LOGOUT
  // =========================================================
  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(["/auth/login"]);
  }

  // =========================================================
  // VERIFICAR LOGIN
  // =========================================================
  isLogged() {
    return !!localStorage.getItem(this.tokenKey);
  }

  // =========================================================
  // PEGAR TOKEN
  // =========================================================
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
}