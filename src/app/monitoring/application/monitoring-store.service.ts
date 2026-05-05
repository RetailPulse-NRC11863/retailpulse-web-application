import { Injectable, signal, computed, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ZoneMetric } from '../domain/model/zone-metric.entity';
import { HeatmapZone } from '../domain/model/heatmap-zone.entity';
import { HeatmapMetric } from '../domain/model/heatmap-metric.entity';
import { ConversionMetric } from '../../sales-conversion/domain/model/conversion-metric.entity';
import { ProductPerformance } from '../../sales-conversion/domain/model/product-performance.entity';
import { StoreZoneLayout } from '../../store-configuration/domain/model/zone.entity';
import { MonitoringApiService } from '../infrastructure/services/monitoring-api.service';
import { SalesConversionApiService } from '../../sales-conversion/infrastructure/services/sales-conversion-api.service';
import { StoreConfigurationApiService } from '../../store-configuration/infrastructure/services/store-configuration-api.service';

export interface ZoneWithMetric {
  zone: StoreZoneLayout;
  metric: HeatmapMetric | null;
}

export interface MonitoringState {
  zoneMetrics: ZoneMetric[];
  heatmapZones: HeatmapZone[];
  heatmapMetrics: HeatmapMetric[];
  storeZoneLayouts: StoreZoneLayout[];
  conversionMetrics: ConversionMetric[];
  productPerformance: ProductPerformance[];
  selectedZoneId: string | null;
  loading: boolean;
  heatmapLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class MonitoringStore {
  private monitoringApi = inject(MonitoringApiService);
  private salesConversionApi = inject(SalesConversionApiService);
  private storeConfigApi = inject(StoreConfigurationApiService);

  private state = signal<MonitoringState>({
    zoneMetrics: [],
    heatmapZones: [],
    heatmapMetrics: [],
    storeZoneLayouts: [],
    conversionMetrics: [],
    productPerformance: [],
    selectedZoneId: null,
    loading: false,
    heatmapLoading: false,
    error: null
  });

  // Signals
  zoneMetrics = computed(() => this.state().zoneMetrics);
  heatmapZones = computed(() => this.state().heatmapZones);
  heatmapMetrics = computed(() => this.state().heatmapMetrics);
  storeZoneLayouts = computed(() => this.state().storeZoneLayouts);
  conversionMetrics = computed(() => this.state().conversionMetrics);
  productPerformance = computed(() => this.state().productPerformance);
  selectedZoneId = computed(() => this.state().selectedZoneId);
  loading = computed(() => this.state().loading);
  heatmapLoading = computed(() => this.state().heatmapLoading);
  error = computed(() => this.state().error);

  // KPIs — all derived from heatmapMetrics so dashboard and heatmap are always in sync
  totalTraffic = computed(() =>
    this.heatmapMetrics().reduce((sum, m) => sum + m.traffic, 0)
  );

  averageDwellTime = computed(() => {
    const metrics = this.heatmapMetrics();
    if (metrics.length === 0) return 0;
    return Math.round(metrics.reduce((sum, m) => sum + m.averageDwellTimeSeconds, 0) / metrics.length);
  });

  totalInteractions = computed(() =>
    this.heatmapMetrics().reduce((sum, m) => sum + m.traffic, 0)
  );

  overallConversionRate = computed(() => {
    const metrics = this.heatmapMetrics();
    if (metrics.length === 0) return 0;
    const weighted = metrics.reduce((sum, m) => sum + m.traffic * m.conversionRate, 0);
    const totalTraffic = metrics.reduce((sum, m) => sum + m.traffic, 0);
    return totalTraffic > 0 ? weighted / totalTraffic / 100 : 0;
  });

  // Heatmap computed signals
  zonesWithMetrics = computed<ZoneWithMetric[]>(() => {
    const layouts = this.storeZoneLayouts();
    const metrics = this.heatmapMetrics();
    return layouts.map(zone => ({
      zone,
      metric: metrics.find(m => m.zoneId === zone.id) || null
    }));
  });

  selectedZoneDetail = computed<ZoneWithMetric | null>(() => {
    const selectedId = this.selectedZoneId();
    if (!selectedId) return null;
    return this.zonesWithMetrics().find(z => z.zone.id === selectedId) || null;
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

  loadHeatmapData() {
    this.state.update(s => ({ ...s, heatmapLoading: true, error: null }));

    forkJoin({
      storeZoneLayouts: this.storeConfigApi.getStoreZoneLayouts(),
      heatmapMetrics: this.monitoringApi.getHeatmapMetrics()
    }).subscribe({
      next: (data) => {
        this.state.update(s => ({
          ...s,
          ...data,
          heatmapLoading: false
        }));
      },
      error: (err) => {
        console.error('Failed to load heatmap data', err);
        this.state.update(s => ({
          ...s,
          error: 'Connection error while loading heatmap data.',
          heatmapLoading: false
        }));
      }
    });
  }

  selectZone(zoneId: string) {
    this.state.update(s => ({ ...s, selectedZoneId: zoneId }));
  }

  clearSelection() {
    this.state.update(s => ({ ...s, selectedZoneId: null }));
  }

  clearError() {
    this.state.update(s => ({ ...s, error: null }));
  }
}
