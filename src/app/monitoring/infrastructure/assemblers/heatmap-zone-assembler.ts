import { BaseAssembler } from '../../../shared/infrastructure/http/base-assembler';
import { HeatmapZone } from '../../domain/model/heatmap-zone.entity';
import { HeatmapZoneResource } from '../resources/heatmap-zone-resource';
import { HeatmapZoneResponse } from '../responses/heatmap-zone-response';

export class HeatmapZoneAssembler implements BaseAssembler<HeatmapZone, HeatmapZoneResource, HeatmapZoneResponse> {
  toEntityFromResource(resource: HeatmapZoneResource): HeatmapZone {
    return new HeatmapZone({
      id: resource.id.toString(),
      zoneId: resource.zoneId,
      intensity: resource.intensity,
      coordinates: resource.coordinates
    });
  }

  toResourceFromEntity(entity: HeatmapZone): HeatmapZoneResource {
    return {
      id: entity.id,
      zoneId: entity.zoneId,
      intensity: entity.intensity,
      coordinates: entity.coordinates
    };
  }

  toEntitiesFromResponse(response: HeatmapZoneResponse): HeatmapZone[] {
    return response.content.map(resource => this.toEntityFromResource(resource));
  }
}
