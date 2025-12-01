import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: "./register.component.html",
})
export class RegisterComponent {
  name = "";
  email = "";
  password = "";
  loading = false;

  constructor(private auth: AuthService) {}

  submit() {
    this.loading = true;

    this.auth.register(this.name, this.email, this.password);

    setTimeout(() => (this.loading = false), 1000);
  }
}