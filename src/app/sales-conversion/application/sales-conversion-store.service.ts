import { Injectable, signal, computed, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ConversionMetric } from '../domain/model/conversion-metric.entity';
import { ProductPerformance } from '../domain/model/product-performance.entity';
import { SalesConversionApiService } from '../infrastructure/services/sales-conversion-api.service';

export interface SalesConversionState {
  conversionMetrics: ConversionMetric[];
  productPerformance: ProductPerformance[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SalesConversionStore {
  private api = inject(SalesConversionApiService);

  private state = signal<SalesConversionState>({
    conversionMetrics: [],
    productPerformance: [],
    loading: false,
    error: null
  });

  // Signals
  conversionMetrics = computed(() => this.state().conversionMetrics);
  productPerformance = computed(() => this.state().productPerformance);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  // Computed data
  topPerformingProducts = computed(() => 
    this.productPerformance()
      .filter(p => p.status === 'GOOD')
      .sort((a, b) => b.performanceScore - a.performanceScore)
  );

  lowPerformingProducts = computed(() => 
    this.productPerformance()
      .filter(p => p.status === 'NEEDS_ATTENTION')
      .sort((a, b) => a.performanceScore - b.performanceScore)
  );

  loadConversionData() {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    forkJoin({
      conversionMetrics: this.api.getConversionMetrics(),
      productPerformance: this.api.getProductPerformance()
    }).subscribe({
      next: (data) => {
        this.state.update(s => ({
          ...s,
          ...data,
          loading: false
        }));
      },
      error: (err) => {
        console.error('Failed to load conversion data', err);
        this.state.update(s => ({
          ...s,
          error: 'Connection error while loading conversion data.',
          loading: false
        }));
      }
    });
  }

  clearError() {
    this.state.update(s => ({ ...s, error: null }));
  }
}
