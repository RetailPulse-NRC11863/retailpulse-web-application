import { BaseResource } from '../../../shared/infrastructure/http/base-response';

export interface ProductPerformanceResource extends BaseResource {
  productId: string;
  productName: string;
  interactions: number;
  conversions?: number;
  sales?: number;
  conversionRate?: number;
  performanceScore?: number;
  availableStock?: number;
  stockStatus?: string;
  zoneName?: string;
  status: string;
  reason?: string;
  recommendationId?: string;
  recommendationTitle?: string;
  priority?: string;
}
