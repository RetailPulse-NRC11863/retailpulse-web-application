import { BaseAssembler } from '../../../shared/infrastructure/http/base-assembler';
import { StoreZoneLayout } from '../../domain/model/zone.entity';
import { StoreZoneLayoutResource } from '../resources/store-zone-layout-resource';
import { StoreZoneLayoutResponse } from '../responses/store-zone-layout-response';

export class ZoneAssembler implements BaseAssembler<StoreZoneLayout, StoreZoneLayoutResource, StoreZoneLayoutResponse> {
  toEntityFromResource(resource: StoreZoneLayoutResource): StoreZoneLayout {
    return new StoreZoneLayout({
      id: resource.id.toString(),
      name: resource.name,
      x: resource.x,
      y: resource.y,
      width: resource.width,
      height: resource.height,
      type: resource.type
    });
  }

  toResourceFromEntity(entity: StoreZoneLayout): StoreZoneLayoutResource {
    return {
      id: entity.id,
      name: entity.name,
      x: entity.x,
      y: entity.y,
      width: entity.width,
      height: entity.height,
      type: entity.type
    };
  }

  toEntitiesFromResponse(response: StoreZoneLayoutResponse): StoreZoneLayout[] {
    return response.content.map(resource => this.toEntityFromResource(resource));
  }
}
