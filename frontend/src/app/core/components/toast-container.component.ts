import { Component } from "@angular/core";
import { NgFor, NgClass, AsyncPipe } from "@angular/common";
import { ToastService } from "../services/toast.service";

@Component({
  selector: "app-toast-container",
  standalone: true,
  imports: [NgFor, NgClass, AsyncPipe],
  templateUrl: "./toast-container.component.html",
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}