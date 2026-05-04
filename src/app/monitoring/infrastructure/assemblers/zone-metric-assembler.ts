import { BaseAssembler } from '../../../shared/infrastructure/http/base-assembler';
import { ZoneMetric } from '../../domain/model/zone-metric.entity';
import { ZoneMetricResource } from '../resources/zone-metric-resource';
import { ZoneMetricResponse } from '../responses/zone-metric-response';

export class ZoneMetricAssembler implements BaseAssembler<ZoneMetric, ZoneMetricResource, ZoneMetricResponse> {
  toEntityFromResource(resource: ZoneMetricResource): ZoneMetric {
    return new ZoneMetric({
      id: resource.id.toString(),
      zoneId: resource.zoneId,
      zoneName: resource.zoneName,
      trafficCount: resource.trafficCount,
      averageDwellTimeSeconds: resource.averageDwellTimeSeconds,
      date: resource.date
    });
  }

  toResourceFromEntity(entity: ZoneMetric): ZoneMetricResource {
    return {
      id: entity.id,
      zoneId: entity.zoneId,
      zoneName: entity.zoneName,
      trafficCount: entity.trafficCount,
      averageDwellTimeSeconds: entity.averageDwellTimeSeconds,
      date: entity.date
    };
  }

  toEntitiesFromResponse(response: ZoneMetricResponse): ZoneMetric[] {
    return response.content.map(resource => this.toEntityFromResource(resource));
  }
}
