import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionStore } from '../../../application/subscription-store.service';
import { SubscriptionCardComponent } from '../../components/subscription-card/subscription-card';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionPlan } from '../../../domain/model/subscription-plan.entity';
import { StripeCheckoutModalComponent } from '../../components/stripe-checkout-modal/stripe-checkout-modal';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-subscription-page',
  standalone: true,
  imports: [CommonModule, SubscriptionCardComponent, TranslateModule, StripeCheckoutModalComponent],
  templateUrl: './subscription-page.html',
  styleUrls: ['./subscription-page.css']
})
export class SubscriptionPageComponent implements OnInit {
  store = inject(SubscriptionStore);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);

  checkoutOpen = false;
  selectedPlan: SubscriptionPlan | null = null;
  upgradeFeature: string | null = null;

  ngOnInit() {
    this.store.loadPlans();
    this.route.queryParamMap.subscribe((params) => {
      this.upgradeFeature = params.get('upgrade');
    });
  }

  getPlanName(planId: string | undefined): string {
    if (!planId) return 'Unknown';
    const plan = this.store.plans().find(p => p.id === planId);
    return plan ? plan.name : planId;
  }

  get activePlan(): SubscriptionPlan | null {
    const activeId = this.store.activeSubscription()?.planId;
    if (!activeId) return null;
    return this.store.plans().find((p) => p.id === activeId) ?? null;
  }

  get lang(): string {
    return this.translate.currentLang || 'en';
  }

  formatRenewalDate(date: Date | undefined): string {
    if (!date) return '';
    const locale = this.lang === 'es' ? 'es-PE' : 'en-US';
    return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: '2-digit' }).format(date);
  }

  getStatusLabel(status: string | undefined): string {
    if (!status) return '';
    const key = `subscription.statusValues.${status}`;
    const translated = this.translate.instant(key);
    return translated === key ? status : translated;
  }

  openCheckout(plan: SubscriptionPlan) {
    this.selectedPlan = plan;
    this.checkoutOpen = true;
  }

  closeCheckout() {
    this.checkoutOpen = false;
    this.selectedPlan = null;
  }

  confirmCheckout() {
    if (!this.selectedPlan) return;
    this.store.changePlan(this.selectedPlan.id);
    this.closeCheckout();
  }
}
