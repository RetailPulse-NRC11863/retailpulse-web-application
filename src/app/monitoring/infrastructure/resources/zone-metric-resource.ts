import { BaseResource } from '../../../shared/infrastructure/http/base-response';

export interface ZoneMetricResource extends BaseResource {
  zoneId: string;
  zoneName: string;
  trafficCount: number;
  averageDwellTimeSeconds: number;
  date: string;
}
