import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  recommended: boolean;
}

export interface ActiveSubscription {
  id: string;
  storeName: string;
  planId: string;
  status: string;
  renewalDate: string;
}

export interface SubscriptionState {
  plans: SubscriptionPlan[];
  activeSubscription: ActiveSubscription | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionStore {
  private http = inject(HttpClient);

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
      plans: this.http.get<SubscriptionPlan[]>('http://localhost:3000/api/v1/plans'),
      activeSubscription: this.http.get<ActiveSubscription>('http://localhost:3000/api/v1/activeSubscription')
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
        console.error('Failed to load subscription data', err);
        this.state.update(s => ({
          ...s,
          error: 'Connection error while loading subscription data.',
          loading: false
        }));
      }
    });
  }
}
