import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SubscriptionPlan } from '../../domain/model/subscription-plan.entity';
import { SaaSAccount } from '../../domain/model/saas-account.entity';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionApiService {
  private http = inject(HttpClient);

  getPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/subscription/plans`).pipe(
      map(data => data.map(item => new SubscriptionPlan(item)))
    );
  }

  getActiveAccount(): Observable<SaaSAccount> {
    return this.http.get<any>(`${environment.apiUrl}/subscription/accounts/current`).pipe(
      map(data => new SaaSAccount(data)),
      tap(account => localStorage.setItem('userPlan', account.planId))
    );
  }

  changePlan(planId: string): Observable<SaaSAccount> {
    return this.patchActiveAccount({ planId });
  }

  patchActiveAccount(patch: Partial<{ planId: string; storeName: string; renewalDate: string | Date; status: string }>): Observable<SaaSAccount> {
    return this.getActiveAccount().pipe(
      switchMap(account => this.http.patch<any>(`${environment.apiUrl}/subscription/accounts/${account.id}/change-plan`, {
        planId: Number(patch.planId ?? account.planId)
      })),
      map(data => new SaaSAccount(data)),
      tap(account => localStorage.setItem('userPlan', account.planId))
    );
  }
}
