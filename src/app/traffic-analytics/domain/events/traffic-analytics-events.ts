export class HeatmapUpdated {
  constructor(
    public readonly timestamp: Date = new Date()
  ) {}
}

export class DeadZoneDetected {
  constructor(
    public readonly zoneId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ZoneCongestionDetected {
  constructor(
    public readonly zoneId: string,
    public readonly intensity: number,
    public readonly timestamp: Date = new Date()
  ) {}
}
