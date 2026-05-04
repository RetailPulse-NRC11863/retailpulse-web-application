import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class ConversionMetric implements BaseEntity {
  id: string;
  zoneId: string;
  totalInteractions: number;
  totalSales: number;
  conversionRate: number;
  date: string;

  constructor(data: {
    id: string;
    zoneId: string;
    totalInteractions: number;
    totalSales: number;
    conversionRate: number;
    date: string;
  }) {
    this.id = data.id;
    this.zoneId = data.zoneId;
    this.totalInteractions = data.totalInteractions;
    this.totalSales = data.totalSales;
    this.conversionRate = data.conversionRate;
    this.date = data.date;
  }
}
