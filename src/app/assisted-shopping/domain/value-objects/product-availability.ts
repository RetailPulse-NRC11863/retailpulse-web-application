export class ProductAvailability {
  constructor(public readonly inStock: boolean, public readonly stockCount: number) {}

  get status(): 'AVAILABLE' | 'OUT_OF_STOCK' | 'LOW_STOCK' {
    if (!this.inStock || this.stockCount === 0) return 'OUT_OF_STOCK';
    if (this.stockCount < 10) return 'LOW_STOCK';
    return 'AVAILABLE';
  }
}
