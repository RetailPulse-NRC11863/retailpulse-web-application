import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class ZoneMetric implements BaseEntity {
  id: string;
  zoneId: string;
  zoneName: string;
  trafficCount: number;
  averageDwellTimeSeconds: number;
  date: string;

  constructor(data: {
    id: string;
    zoneId: string;
    zoneName: string;
    trafficCount: number;
    averageDwellTimeSeconds: number;
    date: string;
  }) {
    this.id = data.id;
    this.zoneId = data.zoneId;
    this.zoneName = data.zoneName;
    this.trafficCount = data.trafficCount;
    this.averageDwellTimeSeconds = data.averageDwellTimeSeconds;
    this.date = data.date;
  }
}
