import {BaseAssembler} from '../../../shared/infrastructure/http/base-assembler';
import {ZoneMetric} from '../../domain/model/zone-metric.entity';
import {ZoneMetricResource} from '../resources/zone-metric-resource';
import {ZoneMetricResponse} from '../responses/zone-metric-response';

export class ZoneMetricAssembler
  implements BaseAssembler<ZoneMetric, ZoneMetricResource, ZoneMetricResponse> {

  toEntityFromResource(resource: ZoneMetricResource): ZoneMetric {
    return new ZoneMetric(resource);
  }

  toResourceFromEntity(entity: ZoneMetric): ZoneMetricResource {
    return { ...entity };
  }

  toEntitiesFromResponse(response: ZoneMetricResponse): ZoneMetric[] {
    return response.content.map(resource => this.toEntityFromResource(resource));
  }
}
