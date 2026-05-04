import { BaseResponse } from '../../../shared/infrastructure/http/base-response';
import { ProductPerformanceResource } from '../resources/product-performance-resource';

export interface ProductPerformanceResponse extends BaseResponse {
  content: ProductPerformanceResource[];
}
