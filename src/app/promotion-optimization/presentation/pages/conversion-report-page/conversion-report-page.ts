import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionOptimizationStore } from '../../../application/promotion-optimization-store.service';
import { ConversionCardComponent } from '../../components/conversion-card/conversion-card';
import { ProductPerformanceCardComponent } from '../../components/product-performance-card/product-performance-card';
import { RecommendationCardComponent } from '../../components/recommendation-card/recommendation-card';
import { LucideAngularModule, RefreshCw, AlertTriangle } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-conversion-report-page',
  standalone: true,
  imports: [
    CommonModule,
    ConversionCardComponent,
    ProductPerformanceCardComponent,
    RecommendationCardComponent,
    LucideAngularModule,
    TranslateModule
  ],
  templateUrl: './conversion-report-page.html',
  styleUrls: ['./conversion-report-page.css']
})
export class ConversionReportPage implements OnInit {
  store = inject(PromotionOptimizationStore);

  readonly RefreshCw = RefreshCw;
  readonly AlertTriangle = AlertTriangle;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.store.loadOptimizationData();
  }

  get isLoading() {
    return this.store.loading();
  }

  get hasError() {
    return this.store.error();
  }
}
