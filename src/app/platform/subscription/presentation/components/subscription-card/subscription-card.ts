import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionPlan } from '../../../domain/model/subscription-plan.entity';
import { LucideAngularModule, Check, Star } from 'lucide-angular';

@Component({
  selector: 'app-subscription-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './subscription-card.html',
  styleUrls: ['./subscription-card.css']
})
export class SubscriptionCardComponent {
  @Input({ required: true }) plan!: SubscriptionPlan;
  @Input() isActive: boolean = false;
  
  readonly Check = Check;
  readonly Star = Star;
}
