import { Injectable, signal, computed, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ZoneMetric } from '../domain/model/zone-metric.entity';
import { HeatmapMetric } from '../domain/model/heatmap-metric.entity';
import { TrafficZone } from '../domain/model/traffic-zone.entity';
import { ConversionGap } from '../../promotion-optimization/domain/model/conversion-gap.entity';
import { ProductPerformance } from '../../promotion-optimization/domain/model/product-performance.entity';
import { TrafficAnalyticsApiService } from '../infrastructure/services/traffic-analytics-api.service';
import { PromotionOptimizationApiService } from '../../promotion-optimization/infrastructure/services/promotion-optimization-api.service';

export interface ZoneWithMetric {
  zone: TrafficZone;
  metric: HeatmapMetric | null;
}

export interface TrafficAnalyticsState {
  zoneMetrics: ZoneMetric[];
  heatmapMetrics: HeatmapMetric[];
  trafficZones: TrafficZone[];
  conversionMetrics: ConversionGap[];
  productPerformance: ProductPerformance[];
  selectedZoneId: string | null;
  loading: boolean;
  heatmapLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TrafficAnalyticsStore {
  private api = inject(TrafficAnalyticsApiService);
  private promotionApi = inject(PromotionOptimizationApiService);

  private state = signal<TrafficAnalyticsState>({
    zoneMetrics: [],
    heatmapMetrics: [],
    trafficZones: [],
    conversionMetrics: [],
    productPerformance: [],
    selectedZoneId: null,
    loading: false,
    heatmapLoading: false,
    error: null
  });

  zoneMetrics = computed(() => this.state().zoneMetrics);
  heatmapMetrics = computed(() => this.state().heatmapMetrics);
  trafficZones = computed(() => this.state().trafficZones);
  conversionMetrics = computed(() => this.state().conversionMetrics);
  productPerformance = computed(() => this.state().productPerformance);
  selectedZoneId = computed(() => this.state().selectedZoneId);
  loading = computed(() => this.state().loading);
  heatmapLoading = computed(() => this.state().heatmapLoading);
  error = computed(() => this.state().error);

  totalTraffic = computed(() =>
    this.heatmapMetrics().reduce((sum, m) => sum + m.traffic, 0)
  );

  totalInteractions = computed(() =>
    this.heatmapMetrics().reduce((sum, m) => sum + m.traffic, 0)
  );

  averageDwellTime = computed(() => {
    const metrics = this.heatmapMetrics();
    if (metrics.length === 0) return 0;
    return Math.round(metrics.reduce((sum, m) => sum + m.averageDwellTimeSeconds, 0) / metrics.length);
  });

  overallConversionRate = computed(() => {
    const metrics = this.heatmapMetrics();
    if (metrics.length === 0) return 0;
    const weighted = metrics.reduce((sum, m) => sum + m.traffic * m.conversionRate, 0);
    const totalTraffic = metrics.reduce((sum, m) => sum + m.traffic, 0);
    return totalTraffic > 0 ? weighted / totalTraffic / 100 : 0;
  });

  zonesWithMetrics = computed<ZoneWithMetric[]>(() => {
    const layouts = this.trafficZones();
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
      trafficZones: this.api.getTrafficZones(),
      heatmapMetrics: this.api.getHeatmapMetrics(),
      zoneMetrics: this.api.getZoneMetrics(),
      conversionMetrics: this.promotionApi.getConversionGaps(),
      productPerformance: this.promotionApi.getProductPerformance()
    }).subscribe({
      next: (data) => {
        this.state.update(s => ({ ...s, ...data, loading: false }));
      },
      error: () => {
        this.state.update(s => ({ ...s, error: 'Failed to load dashboard data.', loading: false }));
      }
    });
  }

  loadHeatmapData() {
    this.state.update(s => ({ ...s, heatmapLoading: true, error: null }));
    forkJoin({
      trafficZones: this.api.getTrafficZones(),
      heatmapMetrics: this.api.getHeatmapMetrics()
    }).subscribe({
      next: (data) => {
        this.state.update(s => ({ ...s, ...data, heatmapLoading: false }));
      },
      error: () => {
        this.state.update(s => ({ ...s, error: 'Failed to load heatmap data.', heatmapLoading: false }));
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
