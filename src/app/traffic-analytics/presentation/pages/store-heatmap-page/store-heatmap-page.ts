import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrafficAnalyticsStore } from '../../../application/traffic-analytics-store.service';
import { StoreHeatmapComponent } from '../../components/store-heatmap/store-heatmap';
import { HeatmapLegendComponent } from '../../components/heatmap-legend/heatmap-legend';
import { ZoneMetricTooltipComponent } from '../../components/zone-metric-tooltip/zone-metric-tooltip';
import { LucideAngularModule, RefreshCw, AlertTriangle } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-store-heatmap-page',
  standalone: true,
  imports: [
    CommonModule,
    StoreHeatmapComponent,
    HeatmapLegendComponent,
    ZoneMetricTooltipComponent,
    LucideAngularModule,
    TranslateModule
  ],
  templateUrl: './store-heatmap-page.html',
  styleUrls: ['./store-heatmap-page.css']
})
export class StoreHeatmapPageComponent implements OnInit {
  store = inject(TrafficAnalyticsStore);

  readonly RefreshCw = RefreshCw;
  readonly AlertTriangle = AlertTriangle;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.store.loadHeatmapData();
  }

  onZoneSelected(zoneId: string) {
    this.store.selectZone(zoneId);
  }
}
