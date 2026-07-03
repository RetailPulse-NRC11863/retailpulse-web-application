import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class ProductPerformance implements BaseEntity {
  id: string;
  productId: string;
  productName: string;
  interactions: number;
  sales: number;
  performanceScore: number;
  status: string;
  zoneName: string;
  stock: number;
  stockStatus: string;
  reason: string;
  recommendationId: string | null;

  constructor(data: {
    id: string;
    productId: string;
    productName: string;
    interactions: number;
    sales: number;
    performanceScore: number;
    status: string;
    zoneName?: string;
    stock?: number;
    stockStatus?: string;
    reason?: string;
    recommendationId?: string | null;
  }) {
    this.id = data.id;
    this.productId = data.productId;
    this.productName = data.productName;
    this.interactions = data.interactions;
    this.sales = data.sales;
    this.performanceScore = data.performanceScore;
    this.status = data.status;
    this.zoneName = data.zoneName || 'Store floor';
    this.stock = data.stock ?? 0;
    this.stockStatus = data.stockStatus || 'UNKNOWN';
    this.reason = data.reason || '';
    this.recommendationId = data.recommendationId || null;
  }

  hasHighInteractionLowConversion(): boolean {
    return this.interactions > 200 && this.performanceScore < 0.4;
  }

  needsAttention(): boolean {
    return this.status === 'NEEDS_ATTENTION' || this.hasHighInteractionLowConversion();
  }
}
