import { BaseAssembler } from '../../../shared/infrastructure/http/base-assembler';
import { ConversionMetric } from '../../domain/model/conversion-metric.entity';
import { ConversionMetricResource } from '../resources/conversion-metric-resource';
import { ConversionMetricResponse } from '../responses/conversion-metric-response';

export class ConversionMetricAssembler implements BaseAssembler<ConversionMetric, ConversionMetricResource, ConversionMetricResponse> {
  toEntityFromResource(resource: ConversionMetricResource): ConversionMetric {
    return new ConversionMetric({
      id: resource.id.toString(),
      zoneId: resource.zoneId,
      totalInteractions: resource.totalInteractions,
      totalSales: resource.totalSales,
      conversionRate: resource.conversionRate,
      date: resource.date
    });
  }

  toResourceFromEntity(entity: ConversionMetric): ConversionMetricResource {
    return {
      id: entity.id,
      zoneId: entity.zoneId,
      totalInteractions: entity.totalInteractions,
      totalSales: entity.totalSales,
      conversionRate: entity.conversionRate,
      date: entity.date
    };
  }

  toEntitiesFromResponse(response: ConversionMetricResponse): ConversionMetric[] {
    return response.content.map(resource => this.toEntityFromResource(resource));
  }
}
