import {Component, computed, effect, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {LucideAngularModule, ChartColumnBig, Settings, ChartLine, CreditCard, Flame, Bell, RefreshCw} from 'lucide-angular';
import {LanguageSwitcher} from '../../components/language-switcher/language-switcher';
import {TranslateModule} from '@ngx-translate/core';
import { SubscriptionStore } from '../../../../platform/subscription/application/subscription-store.service';
import { SubscriptionPlanPolicyService } from '../../../../platform/subscription/application/subscription-plan-policy.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgOptimizedImage, LucideAngularModule, LanguageSwitcher, TranslateModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private readonly router = inject(Router);
  private readonly subscriptionStore = inject(SubscriptionStore);
  readonly saasPolicy = inject(SubscriptionPlanPolicyService);

  readonly isAdminView = computed(() =>
    this.router.url.includes('/app/admin')
  );

  readonly isStaffView = computed(() =>
    this.router.url.includes('/app/staff')
  );
  protected readonly ChartColumnBig = ChartColumnBig;
  protected readonly Settings = Settings;
  protected readonly ChartLine = ChartLine;
  protected readonly CreditCard = CreditCard;
  protected readonly Flame = Flame;
  protected readonly Bell = Bell;
  protected readonly RefreshCw = RefreshCw;

  private readonly _featureRedirectEffect = effect(() => {
    const url = this.router.url;
    const loaded = this.subscriptionStore.loaded();
    const planId = this.subscriptionStore.activeSubscription()?.planId;
    if (!loaded) return;

    const isHeatmap = url.includes('/app/admin/store-heatmap');
    const isConversion = url.includes('/app/admin/conversion');

    if (isHeatmap && !this.saasPolicy.hasCapability('heatmap')) {
      this.router.navigate(['/app/admin/subscription'], { queryParams: { upgrade: 'heatmap' } });
    }

    if (isConversion && !this.saasPolicy.hasCapability('conversion')) {
      this.router.navigate(['/app/admin/subscription'], { queryParams: { upgrade: 'conversion' } });
    }
  });

  constructor() {
    this.subscriptionStore.loadPlans();
  }
}
