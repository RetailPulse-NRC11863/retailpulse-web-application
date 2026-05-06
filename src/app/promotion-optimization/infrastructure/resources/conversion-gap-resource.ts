import {BaseResource} from '../../../shared/infrastructure/http/base-response';

export interface ConversionGapResource extends BaseResource {
  id: string;
  zoneId: string;
  totalInteractions: number;
  totalSales: number;
  conversionRate: number;
  date: string;
}
