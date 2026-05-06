export class ZonePosition {
  constructor(public readonly x: number, public readonly y: number) {}
}

export class ZoneSize {
  constructor(public readonly width: number, public readonly height: number) {
    if (width <= 0 || height <= 0) throw new Error('Size must be positive');
  }
}

export class HeatLevel {
  constructor(public readonly value: number) {
    if (value < 0 || value > 100) throw new Error('Heat level must be between 0 and 100');
  }

  get intensityCategory(): 'COLD' | 'NORMAL' | 'HOT' {
    if (this.value < 30) return 'COLD';
    if (this.value > 70) return 'HOT';
    return 'NORMAL';
  }
}
