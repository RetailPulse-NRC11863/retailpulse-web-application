import {BaseResponse} from '../../../shared/infrastructure/http/base-response';
import {ProductResultResource} from '../resources/product-result-resource';

/**
 * Response envelope for product result collection queries.
 */
export interface ProductResultResponse extends BaseResponse {
  content: ProductResultResource[];
}
