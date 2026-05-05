import { BaseResponse } from '../../../shared/infrastructure/http/base-response';
import { StoreZoneLayoutResource } from '../resources/store-zone-layout-resource';

export interface StoreZoneLayoutResponse extends BaseResponse {
  content: StoreZoneLayoutResource[];
}
