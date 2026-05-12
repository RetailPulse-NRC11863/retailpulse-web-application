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
  loaded: boolean;
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
    error: null,
    loaded: false
  });

  plans = computed(() => this.state().plans);
  activeSubscription = computed(() => this.state().activeSubscription);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  loaded = computed(() => this.state().loaded);

  loadPlans() {
    if (this.state().loaded || this.state().loading) return;
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
          loading: false,
          loaded: true
        }));
      },
      error: (err) => {
        this.state.update(s => ({
          ...s,
          error: 'Connection error while loading subscription data.',
          loading: false,
          loaded: false
        }));
      }
    });
  }

  changePlan(
    planId: string,
    patch?: Partial<{ storeName: string; renewalDate: string | Date; status: string }>
  ) {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    this.api.patchActiveAccount({ planId, ...(patch ?? {}) }).subscribe({
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
