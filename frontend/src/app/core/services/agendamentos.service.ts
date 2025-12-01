import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

export interface Agendamento {
  id: string;
  medico: string;
  data: string;
  horario: string;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: "root"
})
export class AgendamentosService {
  private baseUrl = environment.backendUrl + "/agendamentos";

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Agendamento[]>(this.baseUrl);
  }

  create(payload: { medico: string; data: string; horario: string }) {
    return this.http.post<Agendamento>(this.baseUrl, payload);
  }

  remove(id: string) {
    return this.http.delete(this.baseUrl + "/" + id);
  }
}