import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}

  logout() {
    this.auth.logout();
  }

  getEmail() {
    return "";
  }
}