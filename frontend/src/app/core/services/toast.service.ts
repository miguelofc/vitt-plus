import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface Toast {
  id: number;
  type: "success" | "error" | "info";
  message: string;
}

@Injectable({
  providedIn: "root"
})
export class ToastService {
  private counter = 0;
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  show(type: Toast["type"], message: string) {
    const id = this.counter + 1;
    this.counter = id;

    const current = this.toastsSubject.getValue();
    const next = current.concat([{ id, type, message }]);

    this.toastsSubject.next(next);

    setTimeout(() => {
      this.dismiss(id);
    }, 4000);
  }

  success(message: string) {
    this.show("success", message);
  }

  error(message: string) {
    this.show("error", message);
  }

  info(message: string) {
    this.show("info", message);
  }

  dismiss(id: number) {
    const current = this.toastsSubject.getValue();
    const filtered = current.filter((t) => t.id !== id);
    this.toastsSubject.next(filtered);
  }
}
