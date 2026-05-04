import {BaseResource} from '../../../shared/infrastructure/http/base-response';

/**
 * Resource representation of a product result as returned by the API.
 */
export interface ProductResultResource extends BaseResource {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  zoneName: string;
  shelfReference: string;
  promotion: string | null;
}
