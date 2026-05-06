import { BaseResource } from '../../../shared/infrastructure/http/base-response';

export interface HeatmapMetricResource extends BaseResource {
  zoneId: string;
  traffic: number;
  averageDwellTimeSeconds: number;
  conversionRate: number;
  intensity: number;
  attentionRequired: boolean;
}
