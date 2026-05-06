import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TrafficAnalyticsStore } from '../../../application/traffic-analytics-store.service';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card';
import { StoreHeatmapComponent } from '../../components/store-heatmap/store-heatmap';
import { HeatmapLegendComponent } from '../../components/heatmap-legend/heatmap-legend';
import {
  LucideAngularModule,
  RefreshCw,
  AlertTriangle,
  DoorClosed,
  CreditCard,
  ShoppingCart,
  Package,
  Star,
  MapPin
} from 'lucide-angular';

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
  store = inject(TrafficAnalyticsStore);

  readonly RefreshCw = RefreshCw;
  readonly AlertTriangle = AlertTriangle;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.store.loadDashboardData();
  }

  onZoneSelected(zoneId: string) {
    this.store.selectZone(zoneId);
  }

  getZoneIcon(type: string): any {
    const icons: Record<string, any> = {
      ACCESS:   DoorClosed,
      CHECKOUT: CreditCard,
      AISLE:    ShoppingCart,
      SECTION:  Package,
      PROMO:    Star,
    };
    return icons[type] ?? MapPin;
  }

  getColorForIntensity(intensity: number): string {
    if (intensity >= 81) return '#ef4444';
    if (intensity >= 61) return '#f97316';
    if (intensity >= 41) return '#eab308';
    if (intensity >= 21) return '#22c55e';
    return '#3b82f6';
  }
}
