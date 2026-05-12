import { BaseResponse } from '../../../shared/infrastructure/http/base-response';
import { ZoneMetricResource } from '../resources/zone-metric-resource';

export interface ZoneMetricResponse extends BaseResponse {
  content: ZoneMetricResource[];
}
