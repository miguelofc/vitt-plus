import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";

export const appRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/landing/landing.component").then((m) => m.LandingComponent)
  },
  {
    path: "auth/login",
    loadComponent: () =>
      import("./pages/auth/login/login.component").then((m) => m.LoginComponent)
  },
  {
    path: "auth/register",
    loadComponent: () =>
      import("./pages/auth/register/register.component").then((m) => m.RegisterComponent)
  },
  {
    path: "app",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./pages/layout/app-layout.component").then((m) => m.AppLayoutComponent),
    children: [
      {
        path: "dashboard",
        loadComponent: () =>
          import("./pages/dashboard/dashboard.component").then((m) => m.DashboardComponent)
      },
      {
        path: "agendamentos",
        loadComponent: () =>
          import("./pages/agendamentos/agendamentos.component").then((m) => m.AgendamentosComponent)
      },
      {
        path: "chamadas",
        loadComponent: () =>
          import("./pages/chamadas/chamadas.component").then((m) => m.ChamadasComponent)
      },
      {
        path: "",
        pathMatch: "full",
        redirectTo: "dashboard"
      }
    ]
  },
  {
    path: "**",
    redirectTo: ""
  }
];
