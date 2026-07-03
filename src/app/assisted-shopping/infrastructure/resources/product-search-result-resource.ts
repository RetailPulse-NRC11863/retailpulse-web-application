import {BaseResource} from '../../../shared/infrastructure/http/base-response';

export interface ProductSearchLayoutZoneResource {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ProductSearchResultResource extends BaseResource {
  id: string;
  storeId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  stockStatus: string;
  zoneId: string;
  zoneName: string;
  aisle: string | null;
  shelf: string | null;
  shelfReference: string;
  displayReference: string | null;
  promotion: string | null;
  zoneX: number;
  zoneY: number;
  zoneWidth: number;
  zoneHeight: number;
  layoutZones?: ProductSearchLayoutZoneResource[];
}
