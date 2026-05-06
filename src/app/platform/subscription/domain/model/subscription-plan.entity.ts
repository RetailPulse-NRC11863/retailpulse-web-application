import { BaseEntity } from '../../../../shared/domain/model/base-entity';

export class SubscriptionPlan implements BaseEntity {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  recommended: boolean;

  constructor(data: {
    id: string;
    name: string;
    price: number;
    currency: string;
    description: string;
    features: string[];
    recommended: boolean;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.price = data.price;
    this.currency = data.currency;
    this.description = data.description;
    this.features = data.features;
    this.recommended = data.recommended;
  }

  isFreeTier(): boolean {
    return this.price === 0;
  }

  hasFeature(feature: string): boolean {
    return this.features.includes(feature);
  }
}
