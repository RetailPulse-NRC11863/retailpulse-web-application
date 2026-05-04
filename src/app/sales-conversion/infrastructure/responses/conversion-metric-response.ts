import { BaseResponse } from '../../../shared/infrastructure/http/base-response';
import { ConversionMetricResource } from '../resources/conversion-metric-resource';

export interface ConversionMetricResponse extends BaseResponse {
  content: ConversionMetricResource[];
}
