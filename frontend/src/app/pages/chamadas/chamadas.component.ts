import { Component, ElementRef, ViewChild, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ChamadasService } from "../../core/services/chamadas.service";
import { ToastService } from "../../core/services/toast.service";
import { environment } from "../../environments/environment";

import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  addDoc,
  collectionGroup,
} from "@angular/fire/firestore";

@Component({
  standalone: true,
  selector: "app-chamadas",
  imports: [CommonModule, FormsModule],
  templateUrl: "./chamadas.component.html",
})
export class ChamadasComponent implements OnDestroy {
  @ViewChild("localVideo", { static: true })
  localVideoRef!: ElementRef<HTMLVideoElement>;

  @ViewChild("remoteVideo", { static: true })
  remoteVideoRef!: ElementRef<HTMLVideoElement>;

  roomId = "";
  localStream!: MediaStream;
  remoteStream = new MediaStream();

  pc!: RTCPeerConnection;

  unsubscribeOffer: any;
  unsubscribeAnswer: any;
  unsubscribeCandidatesRemote: any;

  creating = false;
  joining = false;

  constructor(
    private chamadasService: ChamadasService,
    private toast: ToastService,
    private firestore: Firestore
  ) {
    this.initLocalMedia();
  }

  async initLocalMedia() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      this.localVideoRef.nativeElement.srcObject = this.localStream;
      this.localVideoRef.nativeElement.muted = true;
      await this.localVideoRef.nativeElement.play();
    } catch (e) {
      this.toast.error("Não foi possível acessar câmera/microfone.");
    }
  }

  ngOnDestroy() {
    if (this.pc) this.pc.close();
    if (this.unsubscribeOffer) this.unsubscribeOffer();
    if (this.unsubscribeAnswer) this.unsubscribeAnswer();
    if (this.unsubscribeCandidatesRemote)
      this.unsubscribeCandidatesRemote();
  }

  // ==========================================================
  // CONFIGURAÇÃO DO WEBRTC
  // ==========================================================
  createPeerConnection() {
    this.pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
      ],
    });

    this.localStream.getTracks().forEach((track) =>
      this.pc.addTrack(track, this.localStream)
    );

    this.pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((t) => {
        this.remoteStream.addTrack(t);
      });
      this.remoteVideoRef.nativeElement.srcObject = this.remoteStream;
      this.remoteVideoRef.nativeElement.play();
    };

    return this.pc;
  }

  // ==========================================================
  // CRIAR SALA
  // ==========================================================
  async createRoom() {
    try {
      this.creating = true;
      const res = await this.chamadasService.createRoom().toPromise();
      this.roomId = res.roomId;

      this.toast.success("Sala criada. Compartilhe o código.");

      const roomRef = doc(this.firestore, "rooms", this.roomId);

      this.createPeerConnection();

      // 🔹 Criar Offer
      const offerDesc = await this.pc.createOffer();
      await this.pc.setLocalDescription(offerDesc);

      await setDoc(roomRef, {
        offer: {
          type: offerDesc.type,
          sdp: offerDesc.sdp,
        },
      });

      // 🔹 Aguardar Answer do remoto
      this.unsubscribeAnswer = onSnapshot(roomRef, (snap) => {
        const data: any = snap.data();
        if (!this.pc.currentRemoteDescription && data?.answer) {
          const answerDesc = new RTCSessionDescription(data.answer);
          this.pc.setRemoteDescription(answerDesc);
        }
      });

      // 🔹 Enviar ICE locais
      const localCandidates = collection(roomRef, "callerCandidates");
      this.pc.onicecandidate = (event) => {
        if (event.candidate) addDoc(localCandidates, event.candidate.toJSON());
      };

      // 🔹 Escutar ICE remotos
      const remoteCandidates = collection(roomRef, "calleeCandidates");
      this.unsubscribeCandidatesRemote = onSnapshot(
        remoteCandidates,
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const candidate = new RTCIceCandidate(change.doc.data());
              this.pc.addIceCandidate(candidate);
            }
          });
        }
      );
    } catch {
      this.toast.error("Erro ao criar sala.");
    } finally {
      this.creating = false;
    }
  }

  // ==========================================================
  // ENTRAR NA SALA
  // ==========================================================
  async joinRoom() {
    if (!this.roomId) return this.toast.error("Informe o código da sala.");

    try {
      this.joining = true;
      await this.chamadasService.joinRoom(this.roomId).toPromise();

      const roomRef = doc(this.firestore, "rooms", this.roomId);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        return this.toast.error("Sala não encontrada.");
      }

      const roomData: any = roomSnap.data();

      this.createPeerConnection();

      // 🔹 Receber Offer
      const offerDesc = new RTCSessionDescription(roomData.offer);
      await this.pc.setRemoteDescription(offerDesc);

      // 🔹 Criar Answer
      const answerDesc = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answerDesc);

      await setDoc(
        roomRef,
        {
          answer: {
            type: answerDesc.type,
            sdp: answerDesc.sdp,
          },
        },
        { merge: true }
      );

      // 🔹 ICE locais
      const localCandidates = collection(roomRef, "calleeCandidates");
      this.pc.onicecandidate = (event) => {
        if (event.candidate) addDoc(localCandidates, event.candidate.toJSON());
      };

      // 🔹 Receber ICE remotos
      const remoteCandidates = collection(roomRef, "callerCandidates");
      this.unsubscribeCandidatesRemote = onSnapshot(
        remoteCandidates,
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const candidate = new RTCIceCandidate(change.doc.data());
              this.pc.addIceCandidate(candidate);
            }
          });
        }
      );

      this.toast.success("Conectado!");
    } catch {
      this.toast.error("Erro ao entrar na sala.");
    } finally {
      this.joining = false;
    }
  }
}