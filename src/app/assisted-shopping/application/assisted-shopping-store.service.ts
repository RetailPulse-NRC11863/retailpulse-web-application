import { Injectable, signal, computed, inject } from '@angular/core';
import { AssistedProduct } from '../domain/model/assisted-product';
import { AssistedShoppingApiService } from '../infrastructure/services/assisted-shopping-api.service';

export interface AssistedShoppingState {
  searchQuery: string;
  productResults: AssistedProduct[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AssistedShoppingStore {
  private apiService = inject(AssistedShoppingApiService);

  private state = signal<AssistedShoppingState>({
    searchQuery: '',
    productResults: [],
    loading: false,
    error: null,
    hasSearched: false
  });

  searchQuery = computed(() => this.state().searchQuery);
  productResults = computed(() => this.state().productResults);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  hasSearched = computed(() => this.state().hasSearched);

  searchProducts(query: string) {
    if (!query.trim()) {
      this.clearSearch();
      return;
    }

    this.state.update(s => ({ ...s, searchQuery: query, loading: true, error: null, hasSearched: true }));

    this.apiService.searchProducts(query).subscribe({
      next: (results) => {
        this.state.update(s => ({ ...s, productResults: results, loading: false }));
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
      error: null,
      hasSearched: false
    }));
  }
}
