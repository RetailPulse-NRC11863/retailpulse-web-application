import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionStore } from '../../../application/subscription-store.service';
import { SubscriptionPlan } from '../../../domain/model/subscription-plan.entity';
import { StripeCheckoutModalComponent } from '../../components/stripe-checkout-modal/stripe-checkout-modal';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterLink, StripeCheckoutModalComponent],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css'],
})
export class RegisterPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  readonly subscriptionStore = inject(SubscriptionStore);

  selectedPlan: SubscriptionPlan | null = null;
  checkoutOpen = false;

  readonly plans = computed(() => this.subscriptionStore.plans());

  readonly form = new FormBuilder().nonNullable.group({
    storeName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    this.subscriptionStore.loadPlans();
  }

  get lang(): string {
    return this.translate.currentLang || 'en';
  }

  pickPlan(plan: SubscriptionPlan) {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.selectedPlan = plan;
    this.checkoutOpen = true;
  }

  closeCheckout() {
    this.checkoutOpen = false;
    this.selectedPlan = null;
  }

  confirmCheckout() {
    if (!this.selectedPlan) return;
    // Simulación: "registro" + activación de plan (persistido en JSON Server).
    const renewalDate = new Date();
    renewalDate.setDate(renewalDate.getDate() + 30);

    this.subscriptionStore.changePlan(this.selectedPlan.id, {
      storeName: this.form.controls.storeName.value,
      status: 'ACTIVE',
      renewalDate: renewalDate.toISOString().slice(0, 10),
    });
    this.closeCheckout();
    this.router.navigateByUrl('/app/admin/dashboard');
  }
}
