import { Component, ElementRef, ViewChild, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ChamadasService } from "../../core/services/chamadas.service";
import { ToastService } from "../../core/services/toast.service";
import { Firestore } from "@angular/fire/firestore";

@Component({
  standalone: true,
  selector: "app-chamadas",
  imports: [CommonModule, FormsModule],
  templateUrl: "./chamadas.component.html"
})
export class ChamadasComponent {
  @ViewChild("localVideo", { static: true })
  localVideoRef!: ElementRef<HTMLVideoElement>;

  @ViewChild("remoteVideo", { static: true })
  remoteVideoRef!: ElementRef<HTMLVideoElement>;

  firestore = inject(Firestore);

  roomId = "";
  localStream: MediaStream | null = null;

  creatingRoom = false;
  joiningRoom = false;

  constructor(
    private chamadasService: ChamadasService,
    private toast: ToastService
  ) {
    this.initLocalMedia();
  }

  async initLocalMedia() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      this.localStream = stream;
      const video = this.localVideoRef.nativeElement;
      video.srcObject = stream;
      video.muted = true;
      await video.play();
    } catch (error) {
      console.error(error);
      this.toast.error("Não foi possível acessar a câmera.");
    }
  }

  createRoom() {
    this.creatingRoom = true;
    this.chamadasService.createRoom().subscribe({
      next: (res) => {
        if (res && res.roomId) {
          this.roomId = res.roomId;
          this.toast.success("Sala criada. Compartilhe o código com o paciente.");
        }
      },
      error: () => {
        this.toast.error("Erro ao criar sala.");
        this.creatingRoom = false;
      },
      complete: () => {
        this.creatingRoom = false;
      }
    });
  }

  joinRoom() {
    if (!this.roomId) {
      this.toast.error("Informe o código da sala.");
      return;
    }

    this.joiningRoom = true;
    this.chamadasService.joinRoom(this.roomId).subscribe({
      next: () => {
        this.toast.success("Você entrou na sala.");
      },
      error: () => {
        this.toast.error("Erro ao entrar na sala.");
        this.joiningRoom = false;
      },
      complete: () => {
        this.joiningRoom = false;
      }
    });
  }
}