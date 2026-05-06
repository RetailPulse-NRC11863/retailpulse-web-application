import { BaseResource } from '../../../shared/infrastructure/http/base-response';

export interface HeatmapZoneResource extends BaseResource {
  zoneId: string;
  intensity: number;
  coordinates: { x: number; y: number };
}
