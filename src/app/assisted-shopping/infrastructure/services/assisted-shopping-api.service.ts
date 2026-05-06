import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, map} from 'rxjs';
import {BaseApiEndpoint} from '../../../shared/infrastructure/http/base-endpoint';
import {AssistedProduct} from '../../domain/model/assisted-product';
import {ProductSearchResultResource} from '../resources/product-search-result-resource';
import {ProductSearchResultResponse} from '../responses/product-search-result-response';
import {ProductSearchResultAssembler} from '../assemblers/product-search-result-assembler';

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
    super(http, 'http://localhost:3000/api/v1/products', new ProductSearchResultAssembler());
  }

  searchProducts(query: string): Observable<AssistedProduct[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ProductSearchResultResource[]>(this.endpointUrl, {params}).pipe(
      map(data => data.map(resource => this.assembler.toEntityFromResource(resource)))
    );
  }
}
