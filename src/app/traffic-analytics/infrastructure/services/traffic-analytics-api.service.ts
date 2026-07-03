import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HeatmapMetric } from '../../domain/model/heatmap-metric.entity';
import { ZoneMetric } from '../../domain/model/zone-metric.entity';
import { TrafficZone } from '../../domain/model/traffic-zone.entity';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrafficAnalyticsApiService {
  private http = inject(HttpClient);

  getHeatmapMetrics(): Observable<HeatmapMetric[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/traffic/heatmap`).pipe(
      map(data => data.map(item => new HeatmapMetric({
        id: String(item.zoneId),
        zoneId: String(item.zoneId),
        traffic: item.trafficCount ?? 0,
        averageDwellTimeSeconds: item.averageDwellTime ?? 0,
        conversionRate: Math.round((item.conversionRate ?? 0) * 100),
        intensity: this.intensityFromHeatLevel(item.heatLevel),
        attentionRequired: item.heatLevel === 'HOT'
      })))
    );
  }

  getZoneMetrics(): Observable<ZoneMetric[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/traffic/zones/metrics`).pipe(
      map(data => data.map(item => new ZoneMetric({
        id: String(item.zoneId),
        zoneId: String(item.zoneId),
        zoneName: `Zone ${item.zoneId}`,
        metricType: item.congestionStatus,
        value: item.trafficCount ?? 0,
        unit: 'visitors',
        timestamp: new Date().toISOString()
      })))
    );
  }

  getTrafficZones(): Observable<TrafficZone[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/zones`).pipe(
      map(data => data.map(item => new TrafficZone({
        id: String(item.id),
        name: item.name,
        x: item.x ?? 0,
        y: item.y ?? 0,
        width: item.width ?? 160,
        height: item.height ?? 100,
        type: item.type
      })))
    );
  }

  private intensityFromHeatLevel(heatLevel: string): number {
    if (heatLevel === 'HOT') return 88;
    if (heatLevel === 'WARM') return 58;
    return 24;
  }
}
