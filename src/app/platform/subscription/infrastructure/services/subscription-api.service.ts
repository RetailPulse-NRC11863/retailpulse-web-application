import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubscriptionPlan } from '../../domain/model/subscription-plan.entity';
import { SaaSAccount } from '../../domain/model/saas-account.entity';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionApiService {
  private http = inject(HttpClient);

  getPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/plans`).pipe(
      map(data => data.map(item => new SubscriptionPlan(item)))
    );
  }

  getActiveAccount(): Observable<SaaSAccount> {
    return this.http.get<any>(`${environment.apiUrl}/activeSubscription`).pipe(
      map(item => new SaaSAccount(item))
    );
  }

  changePlan(planId: string): Observable<SaaSAccount> {
    return this.http.patch<any>(`${environment.apiUrl}/activeSubscription`, { planId }).pipe(
      map(item => new SaaSAccount(item))
    );
  }

  patchActiveAccount(patch: Partial<{ planId: string; storeName: string; renewalDate: string | Date; status: string }>): Observable<SaaSAccount> {
    return this.http.patch<any>(`${environment.apiUrl}/activeSubscription`, patch).pipe(
      map(item => new SaaSAccount(item))
    );
  }
}
