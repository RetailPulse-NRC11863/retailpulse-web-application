import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { TrafficZone } from './traffic-zone.entity';
import { HeatmapMetric } from './heatmap-metric.entity';

export class StoreLayout implements BaseEntity {
  id: string;
  name: string;
  zones: TrafficZone[] = [];

  constructor(id: string, name: string, zones: TrafficZone[] = []) {
    this.id = id;
    this.name = name;
    this.zones = zones;
  }

  addZone(zone: TrafficZone): void {
    if (!this.zones.find(z => z.id === zone.id)) {
      this.zones.push(zone);
    }
  }

  removeZone(zoneId: string): void {
    this.zones = this.zones.filter(z => z.id !== zoneId);
  }

  moveZone(zoneId: string, x: number, y: number): void {
    const zone = this.zones.find(z => z.id === zoneId);
    if (zone) {
      zone.x = x;
      zone.y = y;
    }
  }

  detectDeadZones(metrics: HeatmapMetric[]): TrafficZone[] {
    const deadZoneIds = metrics
      .filter(m => m.intensity < 20 && m.traffic < 50)
      .map(m => m.zoneId);
    return this.zones.filter(z => deadZoneIds.includes(z.id));
  }
}
