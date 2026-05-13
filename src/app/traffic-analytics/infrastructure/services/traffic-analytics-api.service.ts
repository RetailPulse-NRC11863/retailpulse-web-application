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
    return this.http.get<any[]>(`${environment.apiUrl}/heatmapMetrics`).pipe(
      map(data => data.map(item => new HeatmapMetric(item)))
    );
  }

  getZoneMetrics(): Observable<ZoneMetric[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/zoneMetrics`).pipe(
      map(data => data.map(item => new ZoneMetric(item)))
    );
  }

  getTrafficZones(): Observable<TrafficZone[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/storeLayoutZones`).pipe(
      map(data => data.map(item => new TrafficZone(item)))
    );
  }
}
