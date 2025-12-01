import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgendamentosService, Agendamento } from "../../core/services/agendamentos.service";
import { SkeletonCardComponent } from "../../core/components/skeleton-card.component";

@Component({
  standalone: true,
  selector: "app-dashboard",
  imports: [CommonModule, SkeletonCardComponent],
  templateUrl: "./dashboard.component.html"
})
export class DashboardComponent implements OnInit {
  loading = true;
  agendamentos: Agendamento[] = [];

  totalAgendamentos = 0;
  ultimasChamadas = 0;
  statusUsuario = "Ativo";

  constructor(private agService: AgendamentosService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.agService.list().subscribe({
      next: (items) => {
        this.agendamentos = items;
        this.totalAgendamentos = items.length;
        this.ultimasChamadas = items.length;
      },
      error: () => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
