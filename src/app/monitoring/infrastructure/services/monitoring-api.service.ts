import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../../shared/infrastructure/http/base-endpoint';
import { ZoneMetric } from '../../domain/model/zone-metric.entity';
import { ZoneMetricResource } from '../resources/zone-metric-resource';
import { ZoneMetricResponse } from '../responses/zone-metric-response';
import { ZoneMetricAssembler } from '../assemblers/zone-metric-assembler';
import { HeatmapZone } from '../../domain/model/heatmap-zone.entity';
import { HeatmapZoneResource } from '../resources/heatmap-zone-resource';
import { HeatmapZoneResponse } from '../responses/heatmap-zone-response';
import { HeatmapZoneAssembler } from '../assemblers/heatmap-zone-assembler';

@Injectable({ providedIn: 'root' })
export class ZoneMetricsApiService extends BaseApiEndpoint<ZoneMetric, ZoneMetricResource, ZoneMetricResponse, ZoneMetricAssembler> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/v1/zoneMetrics', new ZoneMetricAssembler());
  }
}

@Injectable({ providedIn: 'root' })
export class HeatmapZonesApiService extends BaseApiEndpoint<HeatmapZone, HeatmapZoneResource, HeatmapZoneResponse, HeatmapZoneAssembler> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/v1/heatmapZones', new HeatmapZoneAssembler());
  }
}

@Injectable({ providedIn: 'root' })
export class MonitoringApiService {
  private zoneMetricsService = inject(ZoneMetricsApiService);
  private heatmapZonesService = inject(HeatmapZonesApiService);

  getZoneMetrics(): Observable<ZoneMetric[]> {
    return this.zoneMetricsService.getAll();
  }

  getHeatmapZones(): Observable<HeatmapZone[]> {
    return this.heatmapZonesService.getAll();
  }
}
