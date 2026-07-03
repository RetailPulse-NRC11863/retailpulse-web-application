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
        totalInteractions: item.interactionCount ?? item.trafficCount ?? 0,
        totalSales: this.estimateSales(item.interactionCount ?? item.trafficCount ?? 0, item.conversionRate ?? 0),
        conversionRate: item.conversionRate ?? 0,
        date: new Date().toISOString()
      })))
    );
  }

  getProductPerformance(): Observable<ProductPerformance[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/promotion-recommendations/product-opportunities`).pipe(
      map(data => data.map(item => new ProductPerformance({
        id: String(item.productId),
        productId: String(item.productId),
        productName: item.productName ?? item.recommendationTitle ?? `Product ${item.productId}`,
        interactions: item.interactions ?? 0,
        sales: item.conversions ?? 0,
        performanceScore: (item.conversionRate ?? 0) / 100,
        status: item.status,
        zoneName: item.zoneName,
        stock: item.availableStock,
        stockStatus: item.stockStatus,
        reason: item.reason,
        recommendationId: item.recommendationId ? String(item.recommendationId) : null
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
    return this.http.patch<void>(`${environment.apiUrl}/promotion-recommendations/${id}/apply`, {});
  }

  private estimateSales(interactions: number, conversionRate: number): number {
    return Math.round(interactions * conversionRate);
  }

}
