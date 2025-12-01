import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  email = "";
  password = "";
  loading = false;

  constructor(private auth: AuthService) {}

  submit() {
    this.loading = true;

    this.auth.login(this.email, this.password);

    // simulação de loading (opcional)
    setTimeout(() => (this.loading = false), 1000);
  }
}