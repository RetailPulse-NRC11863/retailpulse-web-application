import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InventoryItem } from '../../domain/model/inventory-item.entity';

@Injectable({
  providedIn: 'root'
})
export class InventoryIntelligenceApiService {
  private http = inject(HttpClient);
  private endpointUrl = 'http://localhost:3000/api/v1/products';

  getInventory(): Observable<InventoryItem[]> {
    return this.http.get<any[]>(this.endpointUrl).pipe(
      map(data => data.map(item => new InventoryItem(item)))
    );
  }

  addProduct(product: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.post<any>(this.endpointUrl, product).pipe(
      map(item => new InventoryItem(item))
    );
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.endpointUrl}/${productId}`);
  }
}
