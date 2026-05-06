import {BaseAssembler} from '../../../shared/infrastructure/http/base-assembler';
import {AssistedProduct} from '../../domain/model/assisted-product';
import {ProductSearchResultResource} from '../resources/product-search-result-resource';
import {ProductSearchResultResponse} from '../responses/product-search-result-response';

export class ProductSearchResultAssembler
  implements BaseAssembler<AssistedProduct, ProductSearchResultResource, ProductSearchResultResponse> {

  toEntityFromResource(resource: ProductSearchResultResource): AssistedProduct {
    return new AssistedProduct({
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

  toResourceFromEntity(entity: AssistedProduct): ProductSearchResultResource {
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

  toEntitiesFromResponse(response: ProductSearchResultResponse): AssistedProduct[] {
    return response.content.map(resource => this.toEntityFromResource(resource));
  }
}
