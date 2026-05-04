import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class ProductPerformance implements BaseEntity {
  id: string;
  productId: string;
  productName: string;
  interactions: number;
  sales: number;
  performanceScore: number;
  status: string;

  constructor(data: {
    id: string;
    productId: string;
    productName: string;
    interactions: number;
    sales: number;
    performanceScore: number;
    status: string;
  }) {
    this.id = data.id;
    this.productId = data.productId;
    this.productName = data.productName;
    this.interactions = data.interactions;
    this.sales = data.sales;
    this.performanceScore = data.performanceScore;
    this.status = data.status;
  }
}
