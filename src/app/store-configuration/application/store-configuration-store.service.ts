import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

export interface StoreZone {
  id: string;
  name: string;
  sensorCount: number;
  status: string;
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
  zones: StoreZone[];
  products: StoreProduct[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class StoreConfigurationStore {
  private http = inject(HttpClient);

  private state = signal<StoreConfigurationState>({
    storeInfo: null,
    zones: [],
    products: [],
    loading: false,
    error: null
  });

  storeInfo = computed(() => this.state().storeInfo);
  zones = computed(() => this.state().zones);
  products = computed(() => this.state().products);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  loadStoreData() {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    // Fetch products from db.json
    const products$ = this.http.get<StoreProduct[]>('http://localhost:3000/api/v1/products').pipe(
      catchError(() => of([]))
    );

    // Mocking store info and zones since they don't have explicit endpoints in db.json
    const mockStoreInfo: StoreInfo = {
      id: 'S-001',
      name: 'Lima Central',
      location: 'Av. Javier Prado 1234, Lima',
      manager: 'Ana García',
      status: 'ACTIVE'
    };

    const mockZones: StoreZone[] = [
      { id: 'Z001', name: 'Aisle 1 - Beverages', sensorCount: 4, status: 'ONLINE' },
      { id: 'Z002', name: 'Aisle 2 - Groceries', sensorCount: 6, status: 'ONLINE' },
      { id: 'Z003', name: 'Aisle 3 - Cleaning', sensorCount: 3, status: 'OFFLINE' },
      { id: 'Z004', name: 'Aisle 4 - Dairy', sensorCount: 5, status: 'ONLINE' }
    ];

    products$.subscribe({
      next: (products) => {
        this.state.update(s => ({
          ...s,
          storeInfo: mockStoreInfo,
          zones: mockZones,
          products,
          loading: false
        }));
      },
      error: (err) => {
        this.state.update(s => ({
          ...s,
          error: 'Failed to load store configuration.',
          loading: false
        }));
      }
    });
  }
}
