import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesConversionStore } from '../../../application/sales-conversion-store.service';
import { AlertsRecommendationsStore } from '../../../../alerts-recommendations/application/alerts-recommendations-store.service';
import { ConversionCardComponent } from '../../components/conversion-card/conversion-card';
import { ProductPerformanceCardComponent } from '../../components/product-performance-card/product-performance-card';
import { RecommendationCardComponent } from '../../../../alerts-recommendations/presentation/components/recommendation-card/recommendation-card';
import { LucideAngularModule, RefreshCw, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-conversion-report-page',
  standalone: true,
  imports: [
    CommonModule,
    ConversionCardComponent,
    ProductPerformanceCardComponent,
    RecommendationCardComponent,
    LucideAngularModule
  ],
  templateUrl: './conversion-report-page.html',
  styleUrls: ['./conversion-report-page.css']
})
export class ConversionReportPage implements OnInit {
  store = inject(SalesConversionStore);
  alertsStore = inject(AlertsRecommendationsStore);

  readonly RefreshCw = RefreshCw;
  readonly AlertTriangle = AlertTriangle;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.store.loadConversionData();
    this.alertsStore.loadRecommendations();
  }

  get isLoading() {
    return this.store.loading() || this.alertsStore.loading();
  }

  get hasError() {
    return this.store.error() || this.alertsStore.error();
  }
}
