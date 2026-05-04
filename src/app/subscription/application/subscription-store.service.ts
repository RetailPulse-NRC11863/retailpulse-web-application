import { Injectable, signal, computed } from '@angular/core';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingPeriod: string;
  features: string[];
  isCurrent: boolean;
  recommended: boolean;
}

export interface SubscriptionState {
  plans: SubscriptionPlan[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionStore {
  private state = signal<SubscriptionState>({
    plans: [],
    loading: false
  });

  plans = computed(() => this.state().plans);
  loading = computed(() => this.state().loading);
  currentPlan = computed(() => this.state().plans.find(p => p.isCurrent));

  loadPlans() {
    this.state.update(s => ({ ...s, loading: true }));
    
    // Mocking the plans directly since they are static SaaS plans
    setTimeout(() => {
      this.state.update(s => ({
        ...s,
        loading: false,
        plans: [
          {
            id: 'plan_starter',
            name: 'Starter',
            price: 99,
            currency: 'USD',
            billingPeriod: 'month',
            features: [
              'Up to 1 store',
              'Basic Heatmaps',
              'Standard Support',
              'Weekly Reports'
            ],
            isCurrent: false,
            recommended: false
          },
          {
            id: 'plan_growth',
            name: 'Growth',
            price: 299,
            currency: 'USD',
            billingPeriod: 'month',
            features: [
              'Up to 5 stores',
              'Advanced Heatmaps & Dwell Time',
              'Priority Support',
              'Daily AI Recommendations',
              'Real-time alerts'
            ],
            isCurrent: true,
            recommended: true
          },
          {
            id: 'plan_premium',
            name: 'Premium',
            price: 899,
            currency: 'USD',
            billingPeriod: 'month',
            features: [
              'Unlimited stores',
              'Full Data Pipeline API',
              '24/7 Dedicated Support',
              'Custom AI Models',
              'Predictive Analytics'
            ],
            isCurrent: false,
            recommended: false
          }
        ]
      }));
    }, 500);
  }
}
