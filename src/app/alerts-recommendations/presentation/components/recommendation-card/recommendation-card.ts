import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recommendation } from '../../../domain/model/recommendation.entity';
import { LucideAngularModule, Lightbulb, Zap, Crosshair } from 'lucide-angular';

@Component({
  selector: 'app-recommendation-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './recommendation-card.html',
  styleUrls: ['./recommendation-card.css']
})
export class RecommendationCardComponent {
  @Input({ required: true }) recommendation!: Recommendation;

  readonly Lightbulb = Lightbulb;
  readonly Zap = Zap;
  readonly Crosshair = Crosshair;
  
  getIconForType(type: string) {
    if (type === 'MERCHANDISING') return this.Zap;
    if (type === 'LAYOUT') return this.Crosshair;
    return this.Lightbulb;
  }
}
