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
    return this.http.get<any[]>(`${environment.apiUrl}/conversionMetrics`).pipe(
      map(data => data.map(item => new ConversionGap(item)))
    );
  }

  getProductPerformance(): Observable<ProductPerformance[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/productPerformance`).pipe(
      map(data => data.map(item => new ProductPerformance(item)))
    );
  }

  getRecommendations(): Observable<PromotionRecommendation[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/recommendations`).pipe(
      map(data => data.map(item => new PromotionRecommendation(item)))
    );
  }

  applyRecommendation(id: string): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/recommendations/${id}`, { status: 'APPLIED' });
  }
}
