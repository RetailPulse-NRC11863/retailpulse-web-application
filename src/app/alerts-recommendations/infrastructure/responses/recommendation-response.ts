import { BaseResponse } from '../../../shared/infrastructure/http/base-response';
import { RecommendationResource } from '../resources/recommendation-resource';

export interface RecommendationResponse extends BaseResponse {
  content: RecommendationResource[];
}
