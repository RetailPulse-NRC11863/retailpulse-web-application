import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitoringStore } from '../../../application/monitoring-store.service';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card';
import { HeatmapPanelComponent } from '../../components/heatmap-panel/heatmap-panel';
import { ZoneMetricCardComponent } from '../../components/zone-metric-card/zone-metric-card';
import { LucideAngularModule, RefreshCw, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule, 
    KpiCardComponent, 
    HeatmapPanelComponent, 
    ZoneMetricCardComponent,
    LucideAngularModule
  ],
  templateUrl: './dashboard-page.html',
  styleUrls: ['./dashboard-page.css']
})
export class DashboardPageComponent implements OnInit {
  store = inject(MonitoringStore);
  
  readonly RefreshCw = RefreshCw;
  readonly AlertTriangle = AlertTriangle;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.store.loadDashboardData();
  }

  getConversionForZone(zoneId: string) {
    return this.store.conversionMetrics().find(c => c.zoneId === zoneId);
  }
}
