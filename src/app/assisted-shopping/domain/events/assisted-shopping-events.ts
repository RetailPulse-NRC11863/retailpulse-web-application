export class AssistedSearchStarted {
  constructor(
    public readonly sessionId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ProductSearched {
  constructor(
    public readonly sessionId: string,
    public readonly query: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ProductInteractionDetected {
  constructor(
    public readonly sessionId: string,
    public readonly productId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class PromotionShownToShopper {
  constructor(
    public readonly sessionId: string,
    public readonly promotionId: string,
    public readonly productId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}
