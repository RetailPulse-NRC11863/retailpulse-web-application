import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Tag } from 'lucide-angular';

@Component({
  selector: 'app-promotion-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './promotion-card.html',
  styleUrls: ['./promotion-card.css']
})
export class PromotionCardComponent {
  @Input() promotion: string | null = null;
  readonly Tag = Tag;
}
