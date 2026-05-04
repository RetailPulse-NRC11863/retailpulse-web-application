import { BaseAssembler } from '../../../shared/infrastructure/http/base-assembler';
import { Recommendation } from '../../domain/model/recommendation.entity';
import { RecommendationResource } from '../resources/recommendation-resource';
import { RecommendationResponse } from '../responses/recommendation-response';

export class RecommendationAssembler implements BaseAssembler<Recommendation, RecommendationResource, RecommendationResponse> {
  toEntityFromResource(resource: RecommendationResource): Recommendation {
    return new Recommendation({
      id: resource.id.toString(),
      title: resource.title,
      description: resource.description,
      priority: resource.priority,
      type: resource.type,
      createdAt: resource.createdAt
    });
  }

  toResourceFromEntity(entity: Recommendation): RecommendationResource {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      priority: entity.priority,
      type: entity.type,
      createdAt: entity.createdAt.toISOString()
    };
  }

  toEntitiesFromResponse(response: RecommendationResponse): Recommendation[] {
    return response.content.map(resource => this.toEntityFromResource(resource));
  }
}
