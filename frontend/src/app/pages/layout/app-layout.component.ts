import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "../../core/components/navbar.component";
import { SidebarComponent } from "../../core/components/sidebar.component";

@Component({
  standalone: true,
  selector: "app-layout",
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-soft dark:bg-slate-950">
      <app-navbar></app-navbar>

      <div class="flex flex-1">
        <app-sidebar></app-sidebar>

        <main class="flex-1 p-4 md:p-8">
          <div class="max-w-6xl mx-auto">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `
})
export class AppLayoutComponent {}
