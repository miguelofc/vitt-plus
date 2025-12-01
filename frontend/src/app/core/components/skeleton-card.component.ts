import { Component, Input } from "@angular/core";
import { NgFor, NgClass } from "@angular/common";

@Component({
  selector: "app-skeleton-card",
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: "./skeleton-card.component.html",
})
export class SkeletonCardComponent {
  @Input() count = 3;
  @Input() gridClass = "grid grid-cols-1 md:grid-cols-3 gap-4";
}