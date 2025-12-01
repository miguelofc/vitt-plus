import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ChamadasService {
  private baseUrl = environment.backendUrl + "/chamadas";

  constructor(private http: HttpClient) {}

  createRoom() {
    return this.http.post<{ roomId: string }>(this.baseUrl + "/create", {});
  }

  joinRoom(roomId: string) {
    return this.http.post<{ message: string }>(this.baseUrl + "/join", {
      roomId
    });
  }
}
