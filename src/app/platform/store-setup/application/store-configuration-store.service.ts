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
const STORES_API = `${API}/stores`;
const ZONES_API = `${API}/zones`;
const PRODUCTS_API = `${API}/products`;
const INVENTORY_API = `${API}/inventory/items`;
const TRAFFIC_API = `${API}/traffic`;
const DEFAULT_STORE_ID = 1;

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

  loadStoreData() {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    forkJoin({
      stores:   this.http.get<any[]>(STORES_API).pipe(catchError(() => of([]))),
      account:  this.http.get<any>(`${API}/subscription/accounts/current`).pipe(catchError(() => of(null))),
      zones:    this.http.get<any[]>(ZONES_API).pipe(catchError(() => of([]))),
      products: this.http.get<any[]>(PRODUCTS_API).pipe(catchError(() => of([]))),
      inventory: this.http.get<any[]>(INVENTORY_API).pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ stores, account, zones, products, inventory }) => {
        const selectedStore = this.selectStore(stores, account);
        const selectedStoreId = selectedStore?.id;
        const storeZones = selectedStoreId
          ? zones.filter(z => String(z.storeId) === String(selectedStoreId))
          : zones;
        const storeProducts = selectedStoreId
          ? products.filter(p => String(p.storeId) === String(selectedStoreId))
          : products;
        const mappedZones = storeZones.map(z => new TrafficZone({
          id: String(z.id),
          name: z.name,
          x: z.x ?? 0,
          y: z.y ?? 0,
          width: z.width ?? 160,
          height: z.height ?? 100,
          type: z.type
        }));
        this.state.update(s => ({
          ...s,
          storeInfo: selectedStore ? this.mapStoreInfo(selectedStore) : null,
          zones: mappedZones,
          products: storeProducts.map(p => this.mapProduct(p, mappedZones, inventory)),
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
    const newZone = {
      storeId: this.currentStoreId(),
      name: zone.name,
      type: zone.type,
      capacity: 20,
      x: zone.x,
      y: zone.y,
      width: zone.width,
      height: zone.height
    };

    this.http.post<any>(ZONES_API, newZone).pipe(
      switchMap(created => this.upsertZoneMetrics(created.id, metricsData).pipe(
        catchError(() => of(null)),
        switchMap(() => of(new TrafficZone({
          id: String(created.id),
          name: created.name,
          x: created.x,
          y: created.y,
          width: created.width,
          height: created.height,
          type: created.type
        })))
      ))
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
    const zone = this.state().zones.find(z => z.name === product.zoneName);
    const newProduct = {
      storeId: this.currentStoreId(),
      name: product.name,
      sku: `SKU-${Date.now()}`,
      category: product.category,
      description: product.promotion || 'Configured from store setup',
      price: product.price,
      zoneId: zone ? Number(zone.id) : null,
      aisle: product.shelfReference || 'A1',
      shelf: product.shelfReference || 'S1',
      displayReference: product.shelfReference || 'Configured shelf'
    };

    this.http.post<any>(`${API}/products`, newProduct).subscribe({
      next: (created) => {
        this.http.post<any>(INVENTORY_API, {
          productId: created.id,
          availableStock: product.stock ?? 0,
          criticalThreshold: product.criticalThreshold ?? 5
        }).pipe(catchError(() => of(null))).subscribe();
        this.state.update(s => ({
          ...s,
          products: [...s.products, this.mapProduct(created, s.zones, [{ productId: created.id, availableStock: product.stock ?? 0, criticalThreshold: product.criticalThreshold ?? 5 }])],
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
      this.http.put(`${ZONES_API}/${z.id}`, {
        name: z.name,
        type: z.type,
        capacity: 20,
        x: z.x,
        y: z.y,
        width: z.width,
        height: z.height
      }).pipe(catchError(() => of(null)))
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
    const existingZone = this.state().zones.find(z => z.id === zoneId);
    const mergedZone = { ...existingZone, ...zoneUpdates };
    const zonePayload = {
      name: mergedZone.name,
      type: mergedZone.type,
      capacity: 20,
      x: mergedZone.x,
      y: mergedZone.y,
      width: mergedZone.width,
      height: mergedZone.height
    };

    this.http.put<any>(`${ZONES_API}/${zoneId}`, zonePayload).pipe(
      switchMap(updated => {
        if (!metricsData) return of(updated);
        return this.upsertZoneMetrics(zoneId, metricsData).pipe(
          catchError(() => of(null)),
          switchMap(() => of(updated))
        );
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
    const zone = this.state().zones.find(z => z.name === productData.zoneName);
    const merged = { ...existing, ...productData, id: productId };
    const stock = merged.stock ?? 0;
    const productPayload = {
      name: merged.name,
      category: merged.category,
      description: merged.promotion || 'Configured from store setup',
      price: merged.price,
      status: stock <= 0 ? 'OUT_OF_STOCK' : 'ACTIVE',
      zoneId: zone ? Number(zone.id) : null,
      aisle: merged.shelfReference || 'A1',
      shelf: merged.shelfReference || 'S1',
      displayReference: merged.shelfReference || 'Configured shelf'
    };

    this.http.put<any>(`${API}/products/${productId}`, productPayload).subscribe({
      next: (updated) => {
        this.http.patch<any>(`${INVENTORY_API}/${productId}/stock`, {
          availableStock: stock
        }).pipe(catchError(() => of(null))).subscribe();
        this.state.update(s => ({
          ...s,
          products: s.products.map(p => p.id === productId ? new InventoryItem({ ...merged, ...updated, stock: merged.stock }) : p),
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
    this.http.delete(`${ZONES_API}/${zoneId}`).subscribe({
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

  updateStoreInfo(storeInfo: StoreInfo) {
    this.state.update(s => ({ ...s, saving: true, error: null }));
    this.http.put<any>(`${STORES_API}/${storeInfo.id}`, {
      name: storeInfo.name,
      address: storeInfo.location,
      managerName: storeInfo.manager,
      status: storeInfo.status || 'ACTIVE'
    }).subscribe({
      next: (updated) => {
        this.state.update(s => ({
          ...s,
          storeInfo: this.mapStoreInfo(updated),
          saving: false
        }));
      },
      error: () => {
        this.state.update(s => ({
          ...s,
          error: 'Failed to update store information.',
          saving: false
        }));
      }
    });
  }

  private mapProduct(product: any, zones: TrafficZone[], inventoryItems: any[]): InventoryItem {
    const inventory = inventoryItems.find(item => String(item.productId) === String(product.id));
    const zone = zones.find(z => String(z.id) === String(product.zoneId));
    return new InventoryItem({
      id: String(product.id),
      name: product.name,
      category: product.category,
      price: product.price,
      stock: inventory?.availableStock ?? 0,
      criticalThreshold: inventory?.criticalThreshold ?? 5,
      zoneName: zone?.name || 'Unassigned',
      shelfReference: product.shelf || product.aisle || product.displayReference || 'Shelf pending',
      promotion: null
    });
  }

  private selectStore(stores: any[], account: any): any | null {
    if (!stores.length) return null;
    const accountStore = account?.storeId
      ? stores.find(store => String(store.id) === String(account.storeId))
      : null;
    return accountStore ?? stores[0];
  }

  private mapStoreInfo(store: any): StoreInfo {
    return {
      id: String(store.id),
      name: store.name ?? 'Unnamed store',
      location: store.address ?? '',
      manager: store.managerName ?? localStorage.getItem('userName') ?? 'Unassigned',
      status: store.status ?? 'ACTIVE'
    };
  }

  private currentStoreId(): number {
    const storeInfo = this.state().storeInfo;
    return storeInfo ? Number(storeInfo.id) : DEFAULT_STORE_ID;
  }

  private upsertZoneMetrics(
    zoneId: string | number,
    metricsData: { traffic: number; averageDwellTimeSeconds: number; conversionRate: number; intensity: number }
  ) {
    return this.http.post(`${TRAFFIC_API}/zones/${zoneId}/metrics`, {
      trafficCount: metricsData.traffic,
      averageDwellTime: metricsData.averageDwellTimeSeconds,
      interactionCount: metricsData.traffic,
      conversionRate: metricsData.conversionRate,
      intensity: metricsData.intensity
    });
  }
}
