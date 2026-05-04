import {BaseAssembler} from '../../../shared/infrastructure/http/base-assembler';
import {ProductResult} from '../../domain/model/product-result';
import {ProductResultResource} from '../resources/product-result-resource';
import {ProductResultResponse} from '../responses/product-result-response';

/**
 * Assembler that converts between ProductResult entities and API resources.
 */
export class ProductResultAssembler
  implements BaseAssembler<ProductResult, ProductResultResource, ProductResultResponse> {

  /**
   * Converts a ProductResultResource to a ProductResult entity.
   * @param resource - The resource to convert.
   * @returns The converted ProductResult entity.
   */
  toEntityFromResource(resource: ProductResultResource): ProductResult {
    return new ProductResult({
      id: resource.id,
      name: resource.name,
      category: resource.category,
      price: resource.price,
      stock: resource.stock,
      zoneName: resource.zoneName,
      shelfReference: resource.shelfReference,
      promotion: resource.promotion || null
    });
  }

  /**
   * Converts a ProductResult entity to a ProductResultResource.
   * @param entity - The entity to convert.
   * @returns The converted ProductResultResource.
   */
  toResourceFromEntity(entity: ProductResult): ProductResultResource {
    return {
      id: entity.id,
      name: entity.name,
      category: entity.category,
      price: entity.price,
      stock: entity.stock,
      zoneName: entity.zoneName,
      shelfReference: entity.shelfReference,
      promotion: entity.promotion
    };
  }

  /**
   * Converts a ProductResultResponse envelope into a collection of ProductResult entities.
   * @param response - Response payload returned by the API.
   * @returns Array of mapped ProductResult entities.
   */
  toEntitiesFromResponse(response: ProductResultResponse): ProductResult[] {
    return response.content.map(resource => this.toEntityFromResource(resource));
  }
}
