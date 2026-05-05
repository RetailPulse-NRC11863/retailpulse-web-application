import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitoringStore } from '../../../application/monitoring-store.service';
import { StoreHeatmapComponent } from '../../components/store-heatmap/store-heatmap';
import { HeatmapLegendComponent } from '../../components/heatmap-legend/heatmap-legend';
import { ZoneMetricTooltipComponent } from '../../components/zone-metric-tooltip/zone-metric-tooltip';
import { LucideAngularModule, RefreshCw, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-store-heatmap-page',
  standalone: true,
  imports: [
    CommonModule,
    StoreHeatmapComponent,
    HeatmapLegendComponent,
    ZoneMetricTooltipComponent,
    LucideAngularModule
  ],
  templateUrl: './store-heatmap-page.html',
  styleUrls: ['./store-heatmap-page.css']
})
export class StoreHeatmapPageComponent implements OnInit {
  store = inject(MonitoringStore);

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
