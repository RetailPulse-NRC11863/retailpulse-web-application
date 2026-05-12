import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';
import { SubscriptionPlanPolicyService } from '../../application/subscription-plan-policy.service';
import { SubscriptionStore } from '../../application/subscription-store.service';

export function planCapabilityGuard(capability: string): CanActivateFn {
  return () => {
    const policy = inject(SubscriptionPlanPolicyService);
    const router = inject(Router);
    const store = inject(SubscriptionStore);

    store.loadPlans();

    return toObservable(store.loaded).pipe(
      filter((loaded) => loaded),
      take(1),
      map(() => {
        if (policy.hasCapability(capability)) return true;

        return router.createUrlTree(['/app/admin/subscription'], {
          queryParams: { upgrade: capability },
        });
      })
    );
  };
}
