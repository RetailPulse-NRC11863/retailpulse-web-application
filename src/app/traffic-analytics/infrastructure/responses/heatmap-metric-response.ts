import { BaseResponse } from '../../../shared/infrastructure/http/base-response';
import { HeatmapMetricResource } from '../resources/heatmap-metric-resource';

export interface HeatmapMetricResponse extends BaseResponse {
  content: HeatmapMetricResource[];
}
