import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class ZoneMetric implements BaseEntity {
  id: string;
  zoneId: string;
  zoneName: string;
  metricType: string;
  value: number;
  unit: string;
  timestamp: string;

  constructor(data: {
    id: string;
    zoneId: string;
    zoneName: string;
    metricType: string;
    value: number;
    unit: string;
    timestamp: string;
  }) {
    this.id = data.id;
    this.zoneId = data.zoneId;
    this.zoneName = data.zoneName;
    this.metricType = data.metricType;
    this.value = data.value;
    this.unit = data.unit;
    this.timestamp = data.timestamp;
  }
}
