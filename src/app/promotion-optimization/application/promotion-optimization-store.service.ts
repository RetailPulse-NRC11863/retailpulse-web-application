import { Injectable, signal, computed, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ConversionGap } from '../domain/model/conversion-gap.entity';
import { ProductPerformance } from '../domain/model/product-performance.entity';
import { PromotionRecommendation } from '../domain/model/promotion-recommendation.entity';
import { PromotionOptimizationApiService } from '../infrastructure/services/promotion-optimization-api.service';

export interface PromotionOptimizationState {
  conversionGaps: ConversionGap[];
  productPerformance: ProductPerformance[];
  recommendations: PromotionRecommendation[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PromotionOptimizationStore {
  private api = inject(PromotionOptimizationApiService);

  private state = signal<PromotionOptimizationState>({
    conversionGaps: [],
    productPerformance: [],
    recommendations: [],
    loading: false,
    error: null
  });

  conversionGaps = computed(() => this.state().conversionGaps);
  productPerformance = computed(() => this.state().productPerformance);
  recommendations = computed(() => this.state().recommendations);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  topPerformingProducts = computed(() => 
    this.productPerformance()
      .filter(p => p.status === 'GOOD')
      .sort((a, b) => b.performanceScore - a.performanceScore)
  );

  lowPerformingProducts = computed(() => 
    this.productPerformance()
      .filter(p => p.needsAttention())
      .sort((a, b) => a.performanceScore - b.performanceScore)
  );

  loadOptimizationData() {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    forkJoin({
      conversionGaps: this.api.getConversionGaps(),
      productPerformance: this.api.getProductPerformance(),
      recommendations: this.api.getRecommendations()
    }).subscribe({
      next: (data) => {
        this.state.update(s => ({
          ...s,
          ...data,
          loading: false
        }));
      },
      error: (err) => {
        this.state.update(s => ({
          ...s,
          error: 'Connection error while loading optimization data.',
          loading: false
        }));
      }
    });
  }

  applyRecommendation(id: string) {
    this.api.applyRecommendation(id).subscribe({
      next: () => {
        this.state.update(s => ({
          ...s,
          recommendations: s.recommendations.map(r => {
            if (r.id === id) {
              const updated = new PromotionRecommendation(r);
              updated.markAsApplied();
              return updated;
            }
            return r;
          })
        }));
      }
    });
  }
}
