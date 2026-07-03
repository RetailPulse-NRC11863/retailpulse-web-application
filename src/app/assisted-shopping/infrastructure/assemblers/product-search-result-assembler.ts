import {BaseAssembler} from '../../../shared/infrastructure/http/base-assembler';
import {AssistedProduct} from '../../domain/model/assisted-product';
import {ProductSearchResultResource} from '../resources/product-search-result-resource';
import {ProductSearchResultResponse} from '../responses/product-search-result-response';

export class ProductSearchResultAssembler
  implements BaseAssembler<AssistedProduct, ProductSearchResultResource, ProductSearchResultResponse> {

  toEntityFromResource(resource: ProductSearchResultResource): AssistedProduct {
    return new AssistedProduct({
      id: String(resource.id),
      storeId: resource.storeId ? String(resource.storeId) : '',
      name: resource.name,
      category: resource.category,
      price: resource.price,
      stock: resource.stock ?? 0,
      stockStatus: resource.stockStatus,
      zoneId: resource.zoneId ? String(resource.zoneId) : '',
      zoneName: resource.zoneName || 'Unassigned zone',
      aisle: resource.aisle,
      shelf: resource.shelf,
      shelfReference: resource.shelfReference || resource.displayReference || 'Shelf pending',
      displayReference: resource.displayReference,
      promotion: resource.promotion || null,
      zoneX: resource.zoneX,
      zoneY: resource.zoneY,
      zoneWidth: resource.zoneWidth,
      zoneHeight: resource.zoneHeight,
      layoutZones: (resource.layoutZones || []).map(zone => ({
        id: String(zone.id),
        name: zone.name,
        type: zone.type,
        x: zone.x ?? 0,
        y: zone.y ?? 0,
        width: zone.width ?? 160,
        height: zone.height ?? 100
      }))
    });
  }

  toResourceFromEntity(entity: AssistedProduct): ProductSearchResultResource {
    return {
      id: entity.id,
      storeId: entity.storeId,
      name: entity.name,
      category: entity.category,
      price: entity.price,
      stock: entity.stock,
      stockStatus: entity.stockStatus,
      zoneId: entity.zoneId,
      zoneName: entity.zoneName,
      aisle: entity.aisle,
      shelf: entity.shelf,
      shelfReference: entity.shelfReference,
      displayReference: entity.displayReference,
      promotion: entity.promotion,
      zoneX: entity.zoneX,
      zoneY: entity.zoneY,
      zoneWidth: entity.zoneWidth,
      zoneHeight: entity.zoneHeight,
      layoutZones: entity.layoutZones
    };
  }

  toEntitiesFromResponse(response: ProductSearchResultResponse): AssistedProduct[] {
    return response.content.map(resource => this.toEntityFromResource(resource));
  }
}
