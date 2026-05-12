export class PromotionRecommendationGenerated {
  constructor(
    public readonly recommendationId: string,
    public readonly productId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class PromotionApplied {
  constructor(
    public readonly recommendationId: string,
    public readonly productId: string,
    public readonly appliedByStaffId: string | null,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ConversionGapDetected {
  constructor(
    public readonly zoneId: string,
    public readonly conversionRate: number,
    public readonly timestamp: Date = new Date()
  ) {}
}
