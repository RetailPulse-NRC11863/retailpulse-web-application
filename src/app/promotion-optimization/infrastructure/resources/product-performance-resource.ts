import { BaseResource } from '../../../shared/infrastructure/http/base-response';

export interface ProductPerformanceResource extends BaseResource {
  productId: string;
  productName: string;
  interactions: number;
  sales: number;
  performanceScore: number;
  status: string;
}
