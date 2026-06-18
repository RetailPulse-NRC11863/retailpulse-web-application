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
    id: string | number;
    name: string;
    price: number;
    currency?: string;
    description: string;
    features?: string[];
    descriptionI18n?: Record<string, string>;
    featuresI18n?: Record<string, string[]>;
    capabilities?: Record<string, boolean>;
    recommended?: boolean;
  }) {
    this.id = String(data.id);
    this.name = data.name;
    this.price = data.price;
    this.currency = data.currency ?? 'USD';
    this.description = data.description;
    this.features = data.features ?? [data.description];
    this.descriptionI18n = data.descriptionI18n;
    this.featuresI18n = data.featuresI18n;
    this.capabilities = data.capabilities ?? this.defaultCapabilitiesFor(data.name);
    this.recommended = data.recommended ?? data.name === 'GROWTH';
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

  private defaultCapabilitiesFor(planName: string): Record<string, boolean> {
    const normalizedName = planName.toUpperCase();

    return {
      dashboard: true,
      alerts: true,
      kiosk: true,
      conversion: normalizedName === 'GROWTH' || normalizedName === 'PREMIUM',
      heatmap: normalizedName === 'PREMIUM'
    };
  }
}
