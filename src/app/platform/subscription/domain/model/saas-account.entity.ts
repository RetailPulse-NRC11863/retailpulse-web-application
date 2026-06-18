import { BaseEntity } from '../../../../shared/domain/model/base-entity';
import { SubscriptionStatus } from '../value-objects/subscription-status';

export class SaaSAccount implements BaseEntity {
  id: string;
  storeName: string;
  planId: string;
  status: SubscriptionStatus;
  renewalDate: Date;

  constructor(data: {
    id: string;
    storeName?: string;
    storeId?: string | number;
    ownerEmail?: string;
    planId: string;
    status: string;
    renewalDate?: string | Date;
  }) {
    this.id = String(data.id);
    this.storeName = data.storeName ?? data.ownerEmail ?? `Store ${data.storeId ?? ''}`.trim();
    this.planId = String(data.planId);
    this.status = data.status as SubscriptionStatus;
    this.renewalDate = data.renewalDate ? new Date(data.renewalDate) : new Date();
  }

  isActive(): boolean {
    return this.status === SubscriptionStatus.ACTIVE || this.status === SubscriptionStatus.TRIAL;
  }

  needsRenewal(): boolean {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return this.renewalDate <= thirtyDaysFromNow;
  }

  changePlan(newPlanId: string): void {
    this.planId = newPlanId;
  }

  cancelSubscription(): void {
    this.status = SubscriptionStatus.CANCELED;
  }
}
