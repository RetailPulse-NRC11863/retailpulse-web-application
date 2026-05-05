import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { StoreZoneLayout } from '../domain/model/zone.entity';

export interface StoreProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  zoneName: string;
  shelfReference: string;
  promotion: string | null;
}

export interface StoreInfo {
  id: string;
  name: string;
  location: string;
  manager: string;
  status: string;
}

export interface StoreConfigurationState {
  storeInfo: StoreInfo | null;
  zones: StoreZoneLayout[];
  products: StoreProduct[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const API = 'http://localhost:3000/api/v1';

@Injectable({ providedIn: 'root' })
export class StoreConfigurationStore {
  private http = inject(HttpClient);

  private state = signal<StoreConfigurationState>({
    storeInfo: null,
    zones: [],
    products: [],
    loading: false,
    saving: false,
    error: null
  });

  storeInfo = computed(() => this.state().storeInfo);
  zones     = computed(() => this.state().zones);
  products  = computed(() => this.state().products);
  loading   = computed(() => this.state().loading);
  saving    = computed(() => this.state().saving);
  error     = computed(() => this.state().error);

  private readonly mockStoreInfo: StoreInfo = {
    id: 'S-001',
    name: 'Lima Central',
    location: 'Av. Javier Prado 1234, Lima',
    manager: 'Ana García',
    status: 'ACTIVE'
  };

  loadStoreData() {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    forkJoin({
      zones:    this.http.get<StoreZoneLayout[]>(`${API}/storeLayoutZones`).pipe(catchError(() => of([]))),
      products: this.http.get<StoreProduct[]>(`${API}/products`).pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ zones, products }) => {
        this.state.update(s => ({
          ...s,
          storeInfo: this.mockStoreInfo,
          zones,
          products,
          loading: false
        }));
      },
      error: () => {
        this.state.update(s => ({
          ...s,
          error: 'Failed to load store configuration.',
          loading: false
        }));
      }
    });
  }

  addZone(zone: Omit<StoreZoneLayout, 'id'>, metricsData: { traffic: number, averageDwellTimeSeconds: number, conversionRate: number, intensity: number }) {
    this.state.update(s => ({ ...s, saving: true }));
    const newId = 'Z' + Date.now();
    const newZone: StoreZoneLayout = { id: newId, ...zone };

    this.http.post<StoreZoneLayout>(`${API}/storeLayoutZones`, newZone).pipe(
      switchMap(created => {
        const defaultMetric = {
          id: 'HM' + Date.now(),
          zoneId: created.id,
          traffic: metricsData.traffic,
          averageDwellTimeSeconds: metricsData.averageDwellTimeSeconds,
          conversionRate: metricsData.conversionRate,
          intensity: metricsData.intensity,
          attentionRequired: false
        };
        return this.http.post(`${API}/heatmapMetrics`, defaultMetric).pipe(
          catchError(() => of(null)),
          switchMap(() => of(created))
        );
      })
    ).subscribe({
      next: (created) => {
        this.state.update(s => ({
          ...s,
          zones: [...s.zones, created],
          saving: false
        }));
      },
      error: () => {
        this.state.update(s => ({
          ...s,
          error: 'Failed to add zone.',
          saving: false
        }));
      }
    });
  }

  addProduct(product: Omit<StoreProduct, 'id'>) {
    this.state.update(s => ({ ...s, saving: true }));
    const newId = 'P' + Date.now();
    const newProduct: StoreProduct = { id: newId, ...product };

    this.http.post<StoreProduct>(`${API}/products`, newProduct).subscribe({
      next: (created) => {
        this.state.update(s => ({
          ...s,
          products: [...s.products, created],
          saving: false
        }));
      },
      error: () => {
        this.state.update(s => ({
          ...s,
          error: 'Failed to add product.',
          saving: false
        }));
      }
    });
  }

  deleteProduct(productId: string) {
    this.state.update(s => ({ ...s, saving: true }));
    this.http.delete(`${API}/products/${productId}`).subscribe({
      next: () => {
        this.state.update(s => ({
          ...s,
          products: s.products.filter(p => p.id !== productId),
          saving: false
        }));
      },
      error: () => {
        this.state.update(s => ({
          ...s,
          error: 'Failed to delete product.',
          saving: false
        }));
      }
    });
  }

  updateZonePosition(zoneId: string, x: number, y: number) {
    this.state.update(s => ({
      ...s,
      zones: s.zones.map(z => z.id === zoneId ? { ...z, x, y } : z)
    }));
  }

  saveZoneLayout(zones: StoreZoneLayout[]) {
    this.state.update(s => ({ ...s, saving: true }));
    const patches$ = zones.map(z =>
      this.http.patch(`${API}/storeLayoutZones/${z.id}`, { x: z.x, y: z.y, width: z.width, height: z.height }).pipe(catchError(() => of(null)))
    );
    forkJoin(patches$).subscribe({
      next: () => this.state.update(s => ({ ...s, saving: false })),
      error: () => this.state.update(s => ({ ...s, saving: false, error: 'Failed to save layout.' }))
    });
  }

  deleteZone(zoneId: string) {
    this.state.update(s => ({ ...s, saving: true }));
    this.http.delete(`${API}/storeLayoutZones/${zoneId}`).pipe(
      // Also remove the associated heatmap metric
      switchMap(() =>
        this.http.get<any[]>(`${API}/heatmapMetrics?zoneId=${zoneId}`).pipe(
          switchMap(metrics => {
            if (metrics.length > 0) {
              return this.http.delete(`${API}/heatmapMetrics/${metrics[0].id}`).pipe(catchError(() => of(null)));
            }
            return of(null);
          }),
          catchError(() => of(null))
        )
      )
    ).subscribe({
      next: () => {
        this.state.update(s => ({
          ...s,
          zones: s.zones.filter(z => z.id !== zoneId),
          saving: false
        }));
      },
      error: () => {
        this.state.update(s => ({
          ...s,
          error: 'Failed to delete zone.',
          saving: false
        }));
      }
    });
  }
}
