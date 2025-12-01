import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastContainerComponent } from "./core/components/toast-container.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  template: `
    <div class="min-h-screen bg-soft dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <router-outlet></router-outlet>
      <app-toast-container></app-toast-container>
    </div>
  `
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.applySystemTheme();
  }

  private applySystemTheme() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const root = document.documentElement;

    if (prefersDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
}
