import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class HeatmapMetric implements BaseEntity {
  id: string;
  zoneId: string;
  traffic: number;
  averageDwellTimeSeconds: number;
  conversionRate: number;
  intensity: number;
  attentionRequired: boolean;

  constructor(data: {
    id: string;
    zoneId: string;
    traffic: number;
    averageDwellTimeSeconds: number;
    conversionRate: number;
    intensity: number;
    attentionRequired: boolean;
  }) {
    this.id = data.id;
    this.zoneId = data.zoneId;
    this.traffic = data.traffic;
    this.averageDwellTimeSeconds = data.averageDwellTimeSeconds;
    this.conversionRate = data.conversionRate;
    this.intensity = data.intensity;
    this.attentionRequired = data.attentionRequired;
  }
}
