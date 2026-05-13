import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TrafficZone } from '../../../traffic-analytics/domain/model/traffic-zone.entity';
import { InventoryItem } from '../../../inventory-intelligence/domain/model/inventory-item.entity';
import { environment } from '../../../../environments/environment';

export interface StoreInfo {
  id: string;
  name: string;
  location: string;
  manager: string;
  status: string;
}

export interface StoreConfigurationState {
  storeInfo: StoreInfo | null;
  zones: TrafficZone[];
  products: InventoryItem[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const API = `${environment.apiUrl}`;

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
      zones:    this.http.get<any[]>(`${API}/storeLayoutZones`).pipe(catchError(() => of([]))),
      products: this.http.get<any[]>(`${API}/products`).pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ zones, products }) => {
        this.state.update(s => ({
          ...s,
          storeInfo: this.mockStoreInfo,
          zones: zones.map(z => new TrafficZone(z)),
          products: products.map(p => new InventoryItem(p)),
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

  addZone(zone: Omit<TrafficZone, 'id'>, metricsData: { traffic: number, averageDwellTimeSeconds: number, conversionRate: number, intensity: number }) {
    this.state.update(s => ({ ...s, saving: true }));
    const newId = 'Z' + Date.now();
    const newZone = new TrafficZone({ id: newId, ...zone } as any);

    this.http.post<any>(`${API}/storeLayoutZones`, newZone).pipe(
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
          switchMap(() => of(new TrafficZone(created)))
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

  addProduct(product: Partial<InventoryItem>) {
    this.state.update(s => ({ ...s, saving: true }));
    const newId = 'P' + Date.now();
    const newProduct = { id: newId, ...product };

    this.http.post<any>(`${API}/products`, newProduct).subscribe({
      next: (created) => {
        this.state.update(s => ({
          ...s,
          products: [...s.products, new InventoryItem(created)],
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
      zones: s.zones.map(z => {
        if (z.id === zoneId) {
          return new TrafficZone({ ...z, x, y } as any);
        }
        return z;
      })
    }));
  }

  saveZoneLayout(zones: TrafficZone[]) {
    this.state.update(s => ({ ...s, saving: true }));
    const patches$ = zones.map(z =>
      this.http.patch(`${API}/storeLayoutZones/${z.id}`, { x: z.x, y: z.y, width: z.width, height: z.height }).pipe(catchError(() => of(null)))
    );
    forkJoin(patches$).subscribe({
      next: () => this.state.update(s => ({ ...s, saving: false })),
      error: () => this.state.update(s => ({ ...s, saving: false, error: 'Failed to save layout.' }))
    });
  }

  updateZone(
    zoneId: string,
    zoneUpdates: Partial<TrafficZone>,
    metricsData?: { traffic: number; averageDwellTimeSeconds: number; conversionRate: number; intensity: number }
  ) {
    this.state.update(s => ({ ...s, saving: true }));
    this.http.patch<any>(`${API}/storeLayoutZones/${zoneId}`, zoneUpdates).pipe(
      switchMap(updated => {
        if (metricsData) {
          return this.http.get<any[]>(`${API}/heatmapMetrics?zoneId=${zoneId}`).pipe(
            switchMap(metrics => {
              if (metrics.length > 0) {
                return this.http.patch(`${API}/heatmapMetrics/${metrics[0].id}`, metricsData).pipe(
                  catchError(() => of(null)),
                  switchMap(() => of(updated))
                );
              }
              return of(updated);
            }),
            catchError(() => of(updated))
          );
        }
        return of(updated);
      })
    ).subscribe({
      next: (updated) => {
        this.state.update(s => ({
          ...s,
          zones: s.zones.map(z => z.id === zoneId ? new TrafficZone({ ...z, ...updated }) : z),
          saving: false
        }));
      },
      error: () => {
        this.state.update(s => ({
          ...s,
          error: 'Failed to update zone.',
          saving: false
        }));
      }
    });
  }

  updateProduct(productId: string, productData: Partial<InventoryItem>) {
    this.state.update(s => ({ ...s, saving: true }));
    const existing = this.state().products.find(p => p.id === productId);
    const merged = { ...existing, ...productData, id: productId };

    this.http.put<any>(`${API}/products/${productId}`, merged).subscribe({
      next: (updated) => {
        this.state.update(s => ({
          ...s,
          products: s.products.map(p => p.id === productId ? new InventoryItem(updated) : p),
          saving: false
        }));
      },
      error: () => {
        this.state.update(s => ({
          ...s,
          error: 'Failed to update product.',
          saving: false
        }));
      }
    });
  }

  deleteZone(zoneId: string) {
    this.state.update(s => ({ ...s, saving: true }));
    this.http.delete(`${API}/storeLayoutZones/${zoneId}`).pipe(
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
