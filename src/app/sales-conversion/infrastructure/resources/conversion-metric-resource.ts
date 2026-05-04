import { BaseResource } from '../../../shared/infrastructure/http/base-response';

export interface ConversionMetricResource extends BaseResource {
  zoneId: string;
  totalInteractions: number;
  totalSales: number;
  conversionRate: number;
  date: string;
}
