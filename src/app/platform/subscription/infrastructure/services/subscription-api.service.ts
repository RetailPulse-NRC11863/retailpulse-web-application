import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
    return this.http.get<any[]>(`${environment.apiUrl}/subscription/plans`).pipe(
      map(data => data.map(item => new SubscriptionPlan(item)))
    );
  }

  getActiveAccount(): Observable<SaaSAccount> {
    return of(this.demoAccount());
  }

  changePlan(planId: string): Observable<SaaSAccount> {
    return this.patchActiveAccount({ planId });
  }

  patchActiveAccount(patch: Partial<{ planId: string; storeName: string; renewalDate: string | Date; status: string }>): Observable<SaaSAccount> {
    const account = this.demoAccount({ planId: patch.planId });
    localStorage.setItem('userPlan', account.planId);
    return of(account);
  }

  private demoAccount(patch?: Partial<{ planId: string }>): SaaSAccount {
    return new SaaSAccount({
      id: 'demo-current-account',
      storeName: 'RetailPulse Demo Store',
      planId: patch?.planId ?? localStorage.getItem('userPlan') ?? '3',
      status: 'ACTIVE',
      renewalDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
    });
  }
}
