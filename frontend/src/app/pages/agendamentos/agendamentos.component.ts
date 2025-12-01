import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgendamentosService, Agendamento } from "../../core/services/agendamentos.service";
import { FormsModule } from "@angular/forms";
import { ToastService } from "../../core/services/toast.service";

@Component({
  standalone: true,
  selector: "app-agendamentos",
  imports: [CommonModule, FormsModule],
  templateUrl: "./agendamentos.component.html"
})
export class AgendamentosComponent implements OnInit {
  agendamentos: Agendamento[] = [];
  loading = false;

  showModal = false;
  medico = "";
  data = "";
  horario = "";

  constructor(
    private agService: AgendamentosService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;

    this.agService.list().subscribe({
      next: (items) => {
        this.agendamentos = items;
      },
      error: (err) => {
        const msg = err.error?.message || "Erro ao carregar agendamentos.";
        this.toast.error(msg);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  openModal() {
    this.showModal = true;
    this.medico = "";
    this.data = "";
    this.horario = "";
  }

  closeModal() {
    this.showModal = false;
  }

  create() {
    if (!this.medico || !this.data || !this.horario) {
      this.toast.error("Preencha todos os campos.");
      return;
    }

    this.agService
      .create({ medico: this.medico, data: this.data, horario: this.horario })
      .subscribe({
        next: () => {
          this.toast.success("Agendamento criado com sucesso.");
          this.closeModal();
          this.load();
        },
        error: (err) => {
          const msg = err.error?.message || "Erro ao criar agendamento.";
          this.toast.error(msg);
        }
      });
  }

  remove(item: Agendamento) {
    this.agService.remove(item.id).subscribe({
      next: () => {
        this.toast.info("Agendamento removido.");
        this.agendamentos = this.agendamentos.filter(x => x.id !== item.id);
      },
      error: (err) => {
        const msg = err.error?.message || "Erro ao remover agendamento.";
        this.toast.error(msg);
      }
    });
  }
}