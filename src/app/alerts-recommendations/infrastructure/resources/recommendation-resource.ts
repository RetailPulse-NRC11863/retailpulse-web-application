import { BaseResource } from '../../../shared/infrastructure/http/base-response';

export interface RecommendationResource extends BaseResource {
  title: string;
  description: string;
  priority: string;
  type: string;
  createdAt: string;
}
