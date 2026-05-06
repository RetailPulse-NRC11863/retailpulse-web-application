import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionStore } from '../../../application/subscription-store.service';
import { SubscriptionCardComponent } from '../../components/subscription-card/subscription-card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-subscription-page',
  standalone: true,
  imports: [CommonModule, SubscriptionCardComponent, TranslateModule],
  templateUrl: './subscription-page.html',
  styleUrls: ['./subscription-page.css']
})
export class SubscriptionPageComponent implements OnInit {
  store = inject(SubscriptionStore);

  ngOnInit() {
    this.store.loadPlans();
  }

  getPlanName(planId: string | undefined): string {
    if (!planId) return 'Unknown';
    const plan = this.store.plans().find(p => p.id === planId);
    return plan ? plan.name : planId;
  }
}
