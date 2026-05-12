import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { AssistedProduct } from './assisted-product';

export class ShopperSession implements BaseEntity {
  id: string;
  private searchHistory: string[] = [];
  private queriedProducts: AssistedProduct[] = [];
  private startedAt: Date;
  private lastActivityAt: Date;

  constructor(id: string) {
    this.id = id;
    this.startedAt = new Date();
    this.lastActivityAt = new Date();
  }

  registerProductQuery(query: string): void {
    if (query.trim()) {
      this.searchHistory.push(query);
      this.lastActivityAt = new Date();
    }
  }

  registerProductInteraction(product: AssistedProduct): void {
    this.queriedProducts.push(product);
    this.lastActivityAt = new Date();
  }

  getSearchHistory(): string[] {
    return [...this.searchHistory];
  }

  getQueriedProducts(): AssistedProduct[] {
    return [...this.queriedProducts];
  }

  detectAbandonment(): boolean {
    const idleTime = (new Date().getTime() - this.lastActivityAt.getTime()) / 1000;
    return idleTime > 120; // Abandoned if idle for more than 120 seconds
  }
}
