import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class InventoryItem implements BaseEntity {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  criticalThreshold: number;
  zoneName: string;
  shelfReference: string;
  promotion: string | null;

  constructor(data: {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    criticalThreshold?: number;
    zoneName: string;
    shelfReference: string;
    promotion: string | null;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.category = data.category;
    this.price = data.price;
    this.stock = data.stock;
    this.criticalThreshold = data.criticalThreshold || 10;
    this.zoneName = data.zoneName;
    this.shelfReference = data.shelfReference;
    this.promotion = data.promotion;
  }

  isOutOfStock(): boolean {
    return this.stock <= 0;
  }

  isCritical(): boolean {
    return this.stock > 0 && this.stock <= this.criticalThreshold;
  }

  needsRestock(): boolean {
    return this.isOutOfStock() || this.isCritical();
  }

  updateStock(quantity: number): void {
    if (quantity < 0) throw new Error('Stock quantity cannot be negative');
    this.stock = quantity;
  }

  applyPromotion(promotionId: string): void {
    this.promotion = promotionId;
  }

  removePromotion(): void {
    this.promotion = null;
  }
}
