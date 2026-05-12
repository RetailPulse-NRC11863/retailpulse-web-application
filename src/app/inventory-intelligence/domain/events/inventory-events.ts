export class StockDepleted {
  constructor(
    public readonly productId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class StockLevelCritical {
  constructor(
    public readonly productId: string,
    public readonly currentStock: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class InventoryRestocked {
  constructor(
    public readonly productId: string,
    public readonly newStock: number,
    public readonly timestamp: Date = new Date()
  ) {}
}
