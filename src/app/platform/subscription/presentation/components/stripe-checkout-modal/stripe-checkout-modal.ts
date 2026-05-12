import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubscriptionPlan } from '../../../domain/model/subscription-plan.entity';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export type CheckoutMode = 'new' | 'change';

@Component({
  selector: 'app-stripe-checkout-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './stripe-checkout-modal.html',
  styleUrls: ['./stripe-checkout-modal.css'],
})
export class StripeCheckoutModalComponent {
  private readonly translate = inject(TranslateService);

  get lang(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'en';
  }
  @Input({ required: true }) plan!: SubscriptionPlan;
  @Input() currentPlan: SubscriptionPlan | null = null;
  @Input() mode: CheckoutMode = 'change';
  @Input() open: boolean = false;

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  isProcessing = false;
  isSuccess = false;

  readonly form = new FormBuilder().nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    cardNumber: ['', [Validators.required, Validators.minLength(19)]],
    exp: ['', [Validators.required, Validators.minLength(5)]],
    cvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    country: ['US', [Validators.required]],
    postalCode: ['', [Validators.required, Validators.minLength(3)]],
  });

  close() {
    if (this.isProcessing) return;
    this.resetState();
    this.closed.emit();
  }

  submit() {
    if (this.isProcessing) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isProcessing = true;
    this.isSuccess = false;

    // Simulación realista: "procesando" pago.
    setTimeout(() => {
      this.isProcessing = false;
      this.isSuccess = true;
      setTimeout(() => this.confirmed.emit(), 700);
    }, 1400);
  }

  private resetState() {
    this.isProcessing = false;
    this.isSuccess = false;
    this.form.reset({
      email: '',
      cardNumber: '',
      exp: '',
      cvc: '',
      name: '',
      country: 'US',
      postalCode: '',
    });
  }
}
