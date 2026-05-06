import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubscriptionPlan } from '../../domain/model/subscription-plan.entity';
import { SaaSAccount } from '../../domain/model/saas-account.entity';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionApiService {
  private http = inject(HttpClient);

  getPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<any[]>('http://localhost:3000/api/v1/plans').pipe(
      map(data => data.map(item => new SubscriptionPlan(item)))
    );
  }

  getActiveAccount(): Observable<SaaSAccount> {
    return this.http.get<any>('http://localhost:3000/api/v1/activeSubscription').pipe(
      map(item => new SaaSAccount(item))
    );
  }

  changePlan(planId: string): Observable<SaaSAccount> {
    // Mock update
    return this.http.patch<any>('http://localhost:3000/api/v1/activeSubscription', { planId }).pipe(
      map(item => new SaaSAccount(item))
    );
  }
}
