import { BaseAssembler } from '../../../shared/infrastructure/http/base-assembler';
import { HeatmapMetric } from '../../domain/model/heatmap-metric.entity';
import { HeatmapMetricResource } from '../resources/heatmap-metric-resource';
import { HeatmapMetricResponse } from '../responses/heatmap-metric-response';

export class HeatmapMetricAssembler implements BaseAssembler<HeatmapMetric, HeatmapMetricResource, HeatmapMetricResponse> {
  toEntityFromResource(resource: HeatmapMetricResource): HeatmapMetric {
    return new HeatmapMetric({
      id: resource.id.toString(),
      zoneId: resource.zoneId,
      traffic: resource.traffic,
      averageDwellTimeSeconds: resource.averageDwellTimeSeconds,
      conversionRate: resource.conversionRate,
      intensity: resource.intensity,
      attentionRequired: resource.attentionRequired
    });
  }

  toResourceFromEntity(entity: HeatmapMetric): HeatmapMetricResource {
    return {
      id: entity.id,
      zoneId: entity.zoneId,
      traffic: entity.traffic,
      averageDwellTimeSeconds: entity.averageDwellTimeSeconds,
      conversionRate: entity.conversionRate,
      intensity: entity.intensity,
      attentionRequired: entity.attentionRequired
    };
  }

  toEntitiesFromResponse(response: HeatmapMetricResponse): HeatmapMetric[] {
    return response.content.map(resource => this.toEntityFromResource(resource));
  }
}
