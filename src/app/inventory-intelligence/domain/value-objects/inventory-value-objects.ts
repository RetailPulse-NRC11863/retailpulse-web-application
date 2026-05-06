export class StockQuantity {
  constructor(public readonly value: number) {
    if (value < 0) throw new Error('Stock quantity cannot be negative');
  }

  isZero(): boolean {
    return this.value === 0;
  }
}

export class CriticalStockThreshold {
  constructor(public readonly value: number) {
    if (value < 0) throw new Error('Threshold cannot be negative');
  }
}

export class ProductId {
  constructor(public readonly value: string) {
    if (!value) throw new Error('ProductId cannot be empty');
  }
}

export class ShelfLocation {
  constructor(public readonly zoneName: string, public readonly shelfReference: string) {}
}
