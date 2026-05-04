import { BaseAssembler } from '../../../shared/infrastructure/http/base-assembler';
import { ProductPerformance } from '../../domain/model/product-performance.entity';
import { ProductPerformanceResource } from '../resources/product-performance-resource';
import { ProductPerformanceResponse } from '../responses/product-performance-response';

export class ProductPerformanceAssembler implements BaseAssembler<ProductPerformance, ProductPerformanceResource, ProductPerformanceResponse> {
  toEntityFromResource(resource: ProductPerformanceResource): ProductPerformance {
    return new ProductPerformance({
      id: resource.id.toString(),
      productId: resource.productId,
      productName: resource.productName,
      interactions: resource.interactions,
      sales: resource.sales,
      performanceScore: resource.performanceScore,
      status: resource.status
    });
  }

  toResourceFromEntity(entity: ProductPerformance): ProductPerformanceResource {
    return {
      id: entity.id,
      productId: entity.productId,
      productName: entity.productName,
      interactions: entity.interactions,
      sales: entity.sales,
      performanceScore: entity.performanceScore,
      status: entity.status
    };
  }

  toEntitiesFromResponse(response: ProductPerformanceResponse): ProductPerformance[] {
    return response.content.map(resource => this.toEntityFromResource(resource));
  }
}
