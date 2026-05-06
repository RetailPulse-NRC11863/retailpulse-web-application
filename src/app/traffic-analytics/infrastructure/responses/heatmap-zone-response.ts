import { BaseResponse } from '../../../shared/infrastructure/http/base-response';
import { HeatmapZoneResource } from '../resources/heatmap-zone-resource';

export interface HeatmapZoneResponse extends BaseResponse {
  content: HeatmapZoneResource[];
}
