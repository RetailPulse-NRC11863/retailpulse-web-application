import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MonitoringStore } from '../../../application/monitoring-store.service';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card';
import { StoreHeatmapComponent } from '../../components/store-heatmap/store-heatmap';
import { HeatmapLegendComponent } from '../../components/heatmap-legend/heatmap-legend';
import { LucideAngularModule, RefreshCw, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    KpiCardComponent,
    StoreHeatmapComponent,
    HeatmapLegendComponent,
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
    this.store.loadHeatmapData();
  }

  onZoneSelected(zoneId: string) {
    this.store.selectZone(zoneId);
  }

  getZoneIcon(type: string): string {
    switch (type) {
      case 'ACCESS':   return '🚪';
      case 'CHECKOUT': return '💰';
      case 'AISLE':    return '🛒';
      case 'SECTION':  return '📦';
      case 'PROMO':    return '⭐';
      default:         return '📍';
    }
  }

  getColorForIntensity(intensity: number): string {
    if (intensity >= 81) return '#ef4444';
    if (intensity >= 61) return '#f97316';
    if (intensity >= 41) return '#eab308';
    if (intensity >= 21) return '#22c55e';
    return '#3b82f6';
  }
}
