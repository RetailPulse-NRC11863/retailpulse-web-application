import { BaseEntity } from '../../../../shared/domain/model/base-entity';

export class SubscriptionPlan implements BaseEntity {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  descriptionI18n?: Record<string, string>;
  featuresI18n?: Record<string, string[]>;
  capabilities: Record<string, boolean>;
  recommended: boolean;

  constructor(data: {
    id: string;
    name: string;
    price: number;
    currency: string;
    description: string;
    features: string[];
    descriptionI18n?: Record<string, string>;
    featuresI18n?: Record<string, string[]>;
    capabilities?: Record<string, boolean>;
    recommended: boolean;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.price = data.price;
    this.currency = data.currency;
    this.description = data.description;
    this.features = data.features;
    this.descriptionI18n = data.descriptionI18n;
    this.featuresI18n = data.featuresI18n;
    this.capabilities = data.capabilities ?? {};
    this.recommended = data.recommended;
  }

  isFreeTier(): boolean {
    return this.price === 0;
  }

  hasFeature(feature: string): boolean {
    return this.features.includes(feature);
  }

  getDescription(lang: string): string {
    return this.descriptionI18n?.[lang] ?? this.description;
  }

  getFeatures(lang: string): string[] {
    return this.featuresI18n?.[lang] ?? this.features;
  }
}
