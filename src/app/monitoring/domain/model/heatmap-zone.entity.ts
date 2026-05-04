import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class HeatmapZone implements BaseEntity {
  id: string;
  zoneId: string;
  intensity: number;
  coordinates: { x: number; y: number };

  constructor(data: {
    id: string;
    zoneId: string;
    intensity: number;
    coordinates: { x: number; y: number };
  }) {
    this.id = data.id;
    this.zoneId = data.zoneId;
    this.intensity = data.intensity;
    this.coordinates = data.coordinates;
  }
}
