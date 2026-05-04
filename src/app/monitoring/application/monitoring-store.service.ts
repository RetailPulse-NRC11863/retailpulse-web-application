import { Injectable, signal, computed, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ZoneMetric } from '../domain/model/zone-metric.entity';
import { HeatmapZone } from '../domain/model/heatmap-zone.entity';
import { ConversionMetric } from '../../sales-conversion/domain/model/conversion-metric.entity';
import { ProductPerformance } from '../../sales-conversion/domain/model/product-performance.entity';
import { MonitoringApiService } from '../infrastructure/services/monitoring-api.service';
import { SalesConversionApiService } from '../../sales-conversion/infrastructure/services/sales-conversion-api.service';

export interface MonitoringState {
  zoneMetrics: ZoneMetric[];
  heatmapZones: HeatmapZone[];
  conversionMetrics: ConversionMetric[];
  productPerformance: ProductPerformance[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class MonitoringStore {
  private monitoringApi = inject(MonitoringApiService);
  private salesConversionApi = inject(SalesConversionApiService);

  private state = signal<MonitoringState>({
    zoneMetrics: [],
    heatmapZones: [],
    conversionMetrics: [],
    productPerformance: [],
    loading: false,
    error: null
  });

  // Signals
  zoneMetrics = computed(() => this.state().zoneMetrics);
  heatmapZones = computed(() => this.state().heatmapZones);
  conversionMetrics = computed(() => this.state().conversionMetrics);
  productPerformance = computed(() => this.state().productPerformance);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  // Computed KPIs
  totalTraffic = computed(() => 
    this.zoneMetrics().reduce((sum, metric) => sum + metric.trafficCount, 0)
  );

  averageDwellTime = computed(() => {
    const metrics = this.zoneMetrics();
    if (metrics.length === 0) return 0;
    const totalDwell = metrics.reduce((sum, m) => sum + m.averageDwellTimeSeconds, 0);
    return Math.round(totalDwell / metrics.length);
  });

  totalInteractions = computed(() => 
    this.conversionMetrics().reduce((sum, metric) => sum + metric.totalInteractions, 0)
  );

  overallConversionRate = computed(() => {
    const interactions = this.totalInteractions();
    if (interactions === 0) return 0;
    const sales = this.conversionMetrics().reduce((sum, metric) => sum + metric.totalSales, 0);
    return sales / interactions;
  });

  loadDashboardData() {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    forkJoin({
      zoneMetrics: this.monitoringApi.getZoneMetrics(),
      heatmapZones: this.monitoringApi.getHeatmapZones(),
      conversionMetrics: this.salesConversionApi.getConversionMetrics(),
      productPerformance: this.salesConversionApi.getProductPerformance()
    }).subscribe({
      next: (data) => {
        this.state.update(s => ({
          ...s,
          ...data,
          loading: false
        }));
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.state.update(s => ({
          ...s,
          error: 'Connection error while loading dashboard data.',
          loading: false
        }));
      }
    });
  }

  clearError() {
    this.state.update(s => ({ ...s, error: null }));
  }
}
