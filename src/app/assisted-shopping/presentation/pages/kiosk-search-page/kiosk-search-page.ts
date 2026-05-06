import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSearchBoxComponent } from '../../components/product-search-box/product-search-box';
import { ProductResultCardComponent } from '../../components/product-result-card/product-result-card';
import { AssistedShoppingStore } from '../../../application/assisted-shopping-store.service';
import { LucideAngularModule, ShoppingBag, PackageX } from 'lucide-angular';

@Component({
  selector: 'app-kiosk-search-page',
  standalone: true,
  imports: [CommonModule, ProductSearchBoxComponent, ProductResultCardComponent, LucideAngularModule],
  templateUrl: './kiosk-search-page.html',
  styleUrls: ['./kiosk-search-page.css']
})
export class KioskSearchPageComponent {
  store = inject(AssistedShoppingStore);
  readonly ShoppingBag = ShoppingBag;
  readonly PackageX = PackageX;

  onSearch(query: string) {
    this.store.searchProducts(query);
  }

  onClear() {
    this.store.clearSearch();
  }
}
