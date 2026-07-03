import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, catchError, map, switchMap} from 'rxjs';
import {BaseApiEndpoint} from '../../../shared/infrastructure/http/base-endpoint';
import {AssistedProduct} from '../../domain/model/assisted-product';
import {ProductSearchResultResource} from '../resources/product-search-result-resource';
import {ProductSearchResultResponse} from '../responses/product-search-result-response';
import {ProductSearchResultAssembler} from '../assemblers/product-search-result-assembler';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssistedShoppingApiService extends BaseApiEndpoint<
  AssistedProduct,
  ProductSearchResultResource,
  ProductSearchResultResponse,
  ProductSearchResultAssembler
> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/kiosk`, new ProductSearchResultAssembler());
  }

  searchProducts(query: string): Observable<AssistedProduct[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<ProductSearchResultResource[]>(`${this.endpointUrl}/products/search`, {params}).pipe(
      map(data => data.map(resource => this.assembler.toEntityFromResource(resource)))
    );
  }

  startSession(storeId?: number): Observable<{ id: number; storeId: number; status: string }> {
    if (storeId) {
      return this.createSession(storeId);
    }

    return this.http.get<any>(`${environment.apiUrl}/subscription/accounts/current`).pipe(
      switchMap(account => this.createSession(account?.storeId ?? 1)),
      catchError(() => this.createSession(1))
    );
  }

  registerSearch(sessionId: number, query: string, productId: string | null, action = 'SEARCHED'): Observable<void> {
    return this.http.post<void>(`${this.endpointUrl}/sessions/${sessionId}/searches`, {
      query,
      productId: productId ? Number(productId) : null,
      action
    });
  }

  private createSession(storeId: number): Observable<{ id: number; storeId: number; status: string }> {
    return this.http.post<{ id: number; storeId: number; status: string }>(`${this.endpointUrl}/sessions`, { storeId });
  }
}
