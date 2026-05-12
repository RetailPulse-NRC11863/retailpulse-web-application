import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionStore } from '../../../application/subscription-store.service';
import { SubscriptionCardComponent } from '../../components/subscription-card/subscription-card';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionPlan } from '../../../domain/model/subscription-plan.entity';
import { StripeCheckoutModalComponent } from '../../components/stripe-checkout-modal/stripe-checkout-modal';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-subscription-page',
  standalone: true,
  imports: [CommonModule, SubscriptionCardComponent, TranslateModule, StripeCheckoutModalComponent],
  templateUrl: './subscription-page.html',
  styleUrls: ['./subscription-page.css'],
})
export class SubscriptionPageComponent implements OnInit {
  protected readonly store = inject(SubscriptionStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  checkoutOpen = false;
  selectedPlan: SubscriptionPlan | null = null;
  upgradeFeature: string | null = null;

  // Definición de capacidades por plan para la simulación
  private readonly planCapabilities: Record<string, string[]> = {
    starter: ['dashboard', 'alerts'],
    growth: ['dashboard', 'alerts', 'conversion'],
    premium: ['dashboard', 'alerts', 'conversion', 'heatmap'],
  };

  ngOnInit() {
    this.store.loadPlans();
    this.route.queryParamMap.subscribe((params) => {
      this.upgradeFeature = params.get('upgrade');
    });
  }

  get activePlan(): SubscriptionPlan | null {
    const activeId = this.store.activeSubscription()?.planId;
    return this.store.plans().find((p) => p.id === activeId) ?? null;
  }

  openCheckout(plan: SubscriptionPlan) {
    if (plan.id === this.activePlan?.id) return;
    this.selectedPlan = plan;
    this.checkoutOpen = true;
  }

  closeCheckout() {
    this.checkoutOpen = false;
    this.selectedPlan = null;
  }

  confirmCheckout() {
    if (!this.selectedPlan) return;

    // 1. Persistencia en el Store (Backend simulado)
    this.store.changePlan(this.selectedPlan.id);

    // 2. ACTUALIZACIÓN DE CAPACIDADES (Simulación para los Guards)
    // Esto es lo que Fabio quiere: que el sistema "reaccione" al cambio de plan
    localStorage.setItem('userPlan', this.selectedPlan.id);

    alert(
      `¡Plan actualizado a ${this.selectedPlan.name}! Las funciones del sistema se han ajustado.`,
    );

    this.closeCheckout();

    // Recargamos la ruta o la página para que los Guards y el Sidebar se refresquen
    window.location.reload();
  }

  // Helpers para la vista
  getPlanName(planId: string | undefined): string {
    if (!planId) return 'Cargando...';
    return this.store.plans().find((p) => p.id === planId)?.name ?? planId;
  }

  formatRenewalDate(date: Date | undefined): string {
    if (!date) return '--/--/--';
    const locale = this.translate.currentLang === 'es' ? 'es-PE' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(new Date(date));
  }
}
