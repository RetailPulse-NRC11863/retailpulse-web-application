import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ProductResult } from '../../domain/model/product-result';
import { ProductResultAssembler } from '../assemblers/product-result-assembler';

@Injectable({
  providedIn: 'root'
})
export class BuyerAssistanceApiService {
  private readonly baseUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  searchProducts(query: string): Observable<ProductResult[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<any[]>(`${this.baseUrl}/products`, { params }).pipe(
      map(data => ProductResultAssembler.fromDtoList(data))
    );
  }
}
