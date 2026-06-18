import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConversionGap } from '../../domain/model/conversion-gap.entity';
import { ProductPerformance } from '../../domain/model/product-performance.entity';
import { PromotionRecommendation } from '../../domain/model/promotion-recommendation.entity';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromotionOptimizationApiService {
  private http = inject(HttpClient);

  getConversionGaps(): Observable<ConversionGap[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/traffic/congestion`).pipe(
      map(data => data.map(item => new ConversionGap({
        id: String(item.zoneId),
        zoneId: String(item.zoneId),
        totalInteractions: item.trafficCount ?? 0,
        totalSales: this.estimateSalesFromCongestion(item.trafficCount ?? 0, item.congestionStatus),
        conversionRate: this.estimateConversionRate(item.congestionStatus),
        date: new Date().toISOString()
      })))
    );
  }

  getProductPerformance(): Observable<ProductPerformance[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/product-performance`).pipe(
      map(data => data.map(item => new ProductPerformance({
        id: String(item.recommendationId ?? item.productId),
        productId: String(item.productId),
        productName: item.recommendationTitle ?? `Product ${item.productId}`,
        interactions: this.interactionsFromPriority(item.priority),
        sales: this.salesFromPriority(item.priority),
        performanceScore: item.priority === 'HIGH' ? 0.28 : 0.62,
        status: item.priority === 'HIGH' ? 'NEEDS_ATTENTION' : 'GOOD'
      })))
    );
  }

  getRecommendations(): Observable<PromotionRecommendation[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/promotion-recommendations`).pipe(
      map(data => data.map(item => new PromotionRecommendation({
        id: String(item.id),
        type: item.type,
        title: item.title,
        description: item.description,
        priority: item.priority,
        status: item.status,
        zoneId: item.zoneId ? String(item.zoneId) : 'N/A',
        productId: item.productId ? String(item.productId) : null,
        createdAt: item.createdAt ?? new Date().toISOString()
      })))
    );
  }

  applyRecommendation(id: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/promotion-recommendations/${id}/apply`, {});
  }

  private estimateConversionRate(congestionStatus: string): number {
    if (congestionStatus === 'HIGH') return 0.12;
    if (congestionStatus === 'MODERATE') return 0.24;
    return 0.38;
  }

  private estimateSalesFromCongestion(trafficCount: number, congestionStatus: string): number {
    return Math.round(trafficCount * this.estimateConversionRate(congestionStatus));
  }

  private interactionsFromPriority(priority: string): number {
    if (priority === 'HIGH') return 320;
    if (priority === 'MEDIUM') return 180;
    return 90;
  }

  private salesFromPriority(priority: string): number {
    if (priority === 'HIGH') return 42;
    if (priority === 'MEDIUM') return 80;
    return 45;
  }
}
