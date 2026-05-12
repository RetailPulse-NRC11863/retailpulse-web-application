import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionPlan } from '../../../domain/model/subscription-plan.entity';
import { LucideAngularModule, Check, Star } from 'lucide-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-subscription-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TranslateModule],
  templateUrl: './subscription-card.html',
  styleUrls: ['./subscription-card.css']
})
export class SubscriptionCardComponent {
  private readonly translate = inject(TranslateService);

  @Input({ required: true }) plan!: SubscriptionPlan;
  @Input() isActive: boolean = false;
  @Input() actionLabel: string | null = null;
  @Output() selected = new EventEmitter<SubscriptionPlan>();

  get lang(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'en';
  }
  
  readonly Check = Check;
  readonly Star = Star;

  select() {
    if (this.isActive) return;
    this.selected.emit(this.plan);
  }
}
