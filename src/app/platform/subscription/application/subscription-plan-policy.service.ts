import { Injectable, computed, inject } from '@angular/core';
import { SubscriptionStore } from '../../../platform/subscription/application/subscription-store.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionPlanPolicyService {
  private readonly subscriptionStore = inject(SubscriptionStore);

  readonly activePlan = computed(() => {
    const account = this.subscriptionStore.activeSubscription();
    const plans = this.subscriptionStore.plans();
    if (!account) return null;
    return plans.find((p) => p.id === account.planId) ?? null;
  });

  hasCapability(capability: string): boolean {
    const plan = this.activePlan();
    if (!plan) return false;
    return Boolean(plan.capabilities?.[capability]);
  }
}
