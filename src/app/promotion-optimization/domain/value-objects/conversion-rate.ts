export class ConversionRate {
  constructor(public readonly value: number) {
    if (value < 0 || value > 1) throw new Error('Conversion rate must be between 0 and 1');
  }

  isLow(): boolean {
    return this.value < 0.15;
  }

  toPercentage(): string {
    return `${(this.value * 100).toFixed(1)}%`;
  }
}
