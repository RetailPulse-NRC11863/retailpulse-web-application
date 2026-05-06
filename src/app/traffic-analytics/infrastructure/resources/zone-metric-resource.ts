import {BaseResource} from '../../../shared/infrastructure/http/base-response';

export interface ZoneMetricResource extends BaseResource {
  id: string;
  zoneId: string;
  zoneName: string;
  metricType: string;
  value: number;
  unit: string;
  timestamp: string;
}
