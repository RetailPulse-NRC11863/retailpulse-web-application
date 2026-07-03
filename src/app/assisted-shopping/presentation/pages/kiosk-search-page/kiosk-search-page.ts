import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSearchBoxComponent } from '../../components/product-search-box/product-search-box';
import { ProductResultCardComponent } from '../../components/product-result-card/product-result-card';
import { AssistedShoppingStore } from '../../../application/assisted-shopping-store.service';
import { AssistedProduct } from '../../../domain/model/assisted-product';
import { LucideAngularModule, ShoppingBag, PackageX, ArrowLeft } from 'lucide-angular'; // Añadido ArrowLeft
import { LanguageSwitcher } from '../../../../shared/presentation/components/language-switcher/language-switcher';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router'; // Añadido RouterModule

@Component({
  selector: 'app-kiosk-search-page',
  standalone: true,
  imports: [
    CommonModule,
    ProductSearchBoxComponent,
    ProductResultCardComponent,
    LucideAngularModule,
    LanguageSwitcher,
    TranslateModule,
    RouterModule, // Importante para el routerLink
  ],
  templateUrl: './kiosk-search-page.html',
  styleUrls: ['./kiosk-search-page.css'],
})
export class KioskSearchPageComponent implements OnInit {
  store = inject(AssistedShoppingStore);
  expandedLocationProductId: string | null = null;
  readonly ShoppingBag = ShoppingBag;
  readonly PackageX = PackageX;
  readonly ArrowLeft = ArrowLeft; // Registramos el icono

  ngOnInit() {
    this.store.startSession();
  }

  onSearch(query: string) {
    this.expandedLocationProductId = null;
    this.store.searchProducts(query);
  }

  onClear() {
    this.expandedLocationProductId = null;
    this.store.clearSearch();
  }

  onLocationViewed(product: AssistedProduct) {
    const productId = String(product.id);
    if (this.expandedLocationProductId === productId) {
      this.expandedLocationProductId = null;
      return;
    }

    this.expandedLocationProductId = productId;
    this.store.registerLocationViewed(product);
  }

  onFound(product: AssistedProduct) {
    this.store.registerFound(product);
  }

  onHelpRequested(product: AssistedProduct) {
    this.store.requestStaffHelp(product);
  }

  trackByProductId(index: number, product: AssistedProduct): string {
    return String(product.id);
  }
}
