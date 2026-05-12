import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class PromotionRecommendation implements BaseEntity {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  zoneId: string;
  productId: string | null;
  createdAt: Date;

  constructor(data: {
    id: string;
    type: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    zoneId: string;
    productId?: string | null;
    createdAt: Date | string;
  }) {
    this.id = data.id;
    this.type = data.type;
    this.title = data.title;
    this.description = data.description;
    this.priority = data.priority;
    this.status = data.status;
    this.zoneId = data.zoneId;
    this.productId = data.productId || null;
    this.createdAt = new Date(data.createdAt);
  }

  markAsApplied(): void {
    this.status = 'APPLIED';
  }

  isHighPriority(): boolean {
    return this.priority === 'HIGH';
  }
}
