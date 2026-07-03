import { Injectable, signal, computed, inject } from '@angular/core';
import { AssistedProduct } from '../domain/model/assisted-product';
import { AssistedShoppingApiService } from '../infrastructure/services/assisted-shopping-api.service';

export interface AssistedShoppingState {
  searchQuery: string;
  sessionId: number | null;
  productResults: AssistedProduct[];
  loading: boolean;
  actionLoadingProductId: string | null;
  error: string | null;
  hasSearched: boolean;
  lastActionMessage: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AssistedShoppingStore {
  private apiService = inject(AssistedShoppingApiService);

  private state = signal<AssistedShoppingState>({
    searchQuery: '',
    sessionId: null,
    productResults: [],
    loading: false,
    actionLoadingProductId: null,
    error: null,
    hasSearched: false,
    lastActionMessage: null
  });

  searchQuery = computed(() => this.state().searchQuery);
  productResults = computed(() => this.state().productResults);
  sessionId = computed(() => this.state().sessionId);
  loading = computed(() => this.state().loading);
  actionLoadingProductId = computed(() => this.state().actionLoadingProductId);
  error = computed(() => this.state().error);
  hasSearched = computed(() => this.state().hasSearched);
  lastActionMessage = computed(() => this.state().lastActionMessage);

  startSession() {
    if (this.state().sessionId) return;
    this.apiService.startSession().subscribe({
      next: session => this.state.update(s => ({ ...s, sessionId: session.id })),
      error: () => this.state.update(s => ({ ...s, error: 'Could not start kiosk session.' }))
    });
  }

  searchProducts(query: string) {
    if (!query.trim()) {
      this.clearSearch();
      return;
    }

    this.state.update(s => ({ ...s, searchQuery: query, loading: true, error: null, hasSearched: true }));

    this.apiService.searchProducts(query).subscribe({
      next: (results) => {
        this.state.update(s => ({ ...s, productResults: results, loading: false }));
        this.registerSearch(query, results[0]?.id || null, 'SEARCHED');
      },
      error: () => {
        this.state.update(s => ({
          ...s,
          error: 'Error searching for products. Please try again.',
          loading: false,
          productResults: []
        }));
      }
    });
  }

  clearSearch() {
    this.state.update(s => ({
      ...s,
      searchQuery: '',
      productResults: [],
      loading: false,
      actionLoadingProductId: null,
      error: null,
      hasSearched: false,
      lastActionMessage: null
    }));
  }

  registerLocationViewed(product: AssistedProduct) {
    this.registerProductAction(product, 'LOCATION_VIEWED', 'Location viewed on the store map.');
  }

  registerFound(product: AssistedProduct) {
    this.registerProductAction(product, 'FOUND', 'Thanks. This helps the store improve product placement.');
  }

  requestStaffHelp(product: AssistedProduct) {
    this.registerProductAction(product, 'HELP_REQUESTED', 'A staff task was created for this product.');
  }

  private registerProductAction(product: AssistedProduct, action: string, message: string) {
    this.state.update(s => ({ ...s, actionLoadingProductId: product.id, lastActionMessage: null }));
    this.ensureSessionAndRegister(this.state().searchQuery || product.name, product.id, action, () => {
      this.state.update(s => ({ ...s, actionLoadingProductId: null, lastActionMessage: message }));
    });
  }

  private registerSearch(query: string, productId: string | null, action: string) {
    this.ensureSessionAndRegister(query, productId, action);
  }

  private ensureSessionAndRegister(query: string, productId: string | null, action: string, onSuccess?: () => void) {
    const sessionId = this.state().sessionId;
    if (!sessionId) {
      this.apiService.startSession().subscribe({
        next: session => {
          this.state.update(s => ({ ...s, sessionId: session.id }));
          this.apiService.registerSearch(session.id, query, productId, action).subscribe({ next: onSuccess });
        },
        error: () => this.state.update(s => ({ ...s, actionLoadingProductId: null, error: 'Could not register kiosk interaction.' }))
      });
      return;
    }
    this.apiService.registerSearch(sessionId, query, productId, action).subscribe({
      next: onSuccess,
      error: () => this.state.update(s => ({ ...s, actionLoadingProductId: null, error: 'Could not register kiosk interaction.' }))
    });
  }
}
