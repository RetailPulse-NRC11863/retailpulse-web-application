import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../../shared/infrastructure/http/base-endpoint';
import { ConversionMetric } from '../../domain/model/conversion-metric.entity';
import { ConversionMetricResource } from '../resources/conversion-metric-resource';
import { ConversionMetricResponse } from '../responses/conversion-metric-response';
import { ConversionMetricAssembler } from '../assemblers/conversion-metric-assembler';
import { ProductPerformance } from '../../domain/model/product-performance.entity';
import { ProductPerformanceResource } from '../resources/product-performance-resource';
import { ProductPerformanceResponse } from '../responses/product-performance-response';
import { ProductPerformanceAssembler } from '../assemblers/product-performance-assembler';

@Injectable({ providedIn: 'root' })
export class ConversionMetricsApiService extends BaseApiEndpoint<ConversionMetric, ConversionMetricResource, ConversionMetricResponse, ConversionMetricAssembler> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/v1/conversionMetrics', new ConversionMetricAssembler());
  }
}

@Injectable({ providedIn: 'root' })
export class ProductPerformanceApiService extends BaseApiEndpoint<ProductPerformance, ProductPerformanceResource, ProductPerformanceResponse, ProductPerformanceAssembler> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/v1/productPerformance', new ProductPerformanceAssembler());
  }
}

@Injectable({ providedIn: 'root' })
export class SalesConversionApiService {
  private conversionMetricsService = inject(ConversionMetricsApiService);
  private productPerformanceService = inject(ProductPerformanceApiService);

  getConversionMetrics(): Observable<ConversionMetric[]> {
    return this.conversionMetricsService.getAll();
  }

  getProductPerformance(): Observable<ProductPerformance[]> {
    return this.productPerformanceService.getAll();
  }
}
