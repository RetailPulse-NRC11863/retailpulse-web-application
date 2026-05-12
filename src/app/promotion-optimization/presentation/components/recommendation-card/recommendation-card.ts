import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionRecommendation } from '../../../domain/model/promotion-recommendation.entity';
import { LucideAngularModule, Lightbulb, Zap, Crosshair } from 'lucide-angular';

@Component({
  selector: 'app-recommendation-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './recommendation-card.html',
  styleUrls: ['./recommendation-card.css']
})
export class RecommendationCardComponent {
  @Input({ required: true }) recommendation!: PromotionRecommendation;
  @Output() apply = new EventEmitter<string>();

  readonly Lightbulb = Lightbulb;
  readonly Zap = Zap;
  readonly Crosshair = Crosshair;
  
  getIconForType(type: string) {
    if (type === 'MERCHANDISING') return this.Zap;
    if (type === 'LAYOUT') return this.Crosshair;
    return this.Lightbulb;
  }

  onApply() {
    this.apply.emit(this.recommendation.id);
  }
}
