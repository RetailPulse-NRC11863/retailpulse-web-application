import {BaseResponse} from '../../../shared/infrastructure/http/base-response';
import {ProductSearchResultResource} from '../resources/product-search-result-resource';

export interface ProductSearchResultResponse extends BaseResponse {
  content: ProductSearchResultResource[];
}
