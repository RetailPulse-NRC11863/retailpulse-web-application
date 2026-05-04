import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, map} from 'rxjs';
import {BaseApiEndpoint} from '../../../shared/infrastructure/http/base-endpoint';
import {ProductResult} from '../../domain/model/product-result';
import {ProductResultResource} from '../resources/product-result-resource';
import {ProductResultResponse} from '../responses/product-result-response';
import {ProductResultAssembler} from '../assemblers/product-result-assembler';

@Injectable({
  providedIn: 'root'
})
export class BuyerAssistanceApiService extends BaseApiEndpoint<
  ProductResult,
  ProductResultResource,
  ProductResultResponse,
  ProductResultAssembler
> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/v1/products', new ProductResultAssembler());
  }

  /**
   * Searches products by a query string.
   * @param query - The search query.
   * @returns Stream with the matched product results.
   */
  searchProducts(query: string): Observable<ProductResult[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ProductResultResource[]>(this.endpointUrl, {params}).pipe(
      map(data => data.map(resource => this.assembler.toEntityFromResource(resource)))
    );
  }
}
