import { Injectable, signal, computed, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { SubscriptionPlan } from '../domain/model/subscription-plan.entity';
import { SaaSAccount } from '../domain/model/saas-account.entity';
import { SubscriptionApiService } from '../infrastructure/services/subscription-api.service';

export interface SubscriptionState {
  plans: SubscriptionPlan[];
  activeSubscription: SaaSAccount | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionStore {
  private api = inject(SubscriptionApiService);

  private state = signal<SubscriptionState>({
    plans: [],
    activeSubscription: null,
    loading: false,
    error: null
  });

  plans = computed(() => this.state().plans);
  activeSubscription = computed(() => this.state().activeSubscription);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  loadPlans() {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    
    forkJoin({
      plans: this.api.getPlans(),
      activeSubscription: this.api.getActiveAccount()
    }).subscribe({
      next: (data) => {
        this.state.update(s => ({
          ...s,
          plans: data.plans,
          activeSubscription: data.activeSubscription,
          loading: false
        }));
      },
      error: (err) => {
        this.state.update(s => ({
          ...s,
          error: 'Connection error while loading subscription data.',
          loading: false
        }));
      }
    });
  }

  changePlan(planId: string) {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    this.api.changePlan(planId).subscribe({
      next: (updatedAccount) => {
        this.state.update(s => ({
          ...s,
          activeSubscription: updatedAccount,
          loading: false
        }));
      },
      error: (err) => {
        this.state.update(s => ({
          ...s,
          error: 'Failed to change plan.',
          loading: false
        }));
      }
    });
  }
}
