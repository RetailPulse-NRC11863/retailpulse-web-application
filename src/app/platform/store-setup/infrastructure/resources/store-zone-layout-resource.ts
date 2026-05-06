import { BaseResource } from '../../../../shared/infrastructure/http/base-response';

export interface StoreZoneLayoutResource extends BaseResource {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
}
