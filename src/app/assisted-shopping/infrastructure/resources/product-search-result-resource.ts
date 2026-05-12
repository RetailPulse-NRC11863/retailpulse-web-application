import {BaseResource} from '../../../shared/infrastructure/http/base-response';

export interface ProductSearchResultResource extends BaseResource {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  zoneName: string;
  shelfReference: string;
  promotion: string | null;
}
