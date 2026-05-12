import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSearchBoxComponent } from '../../components/product-search-box/product-search-box';
import { ProductResultCardComponent } from '../../components/product-result-card/product-result-card';
import { AssistedShoppingStore } from '../../../application/assisted-shopping-store.service';
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
export class KioskSearchPageComponent {
  store = inject(AssistedShoppingStore);
  readonly ShoppingBag = ShoppingBag;
  readonly PackageX = PackageX;
  readonly ArrowLeft = ArrowLeft; // Registramos el icono

  onSearch(query: string) {
    this.store.searchProducts(query);
  }

  onClear() {
    this.store.clearSearch();
  }
}
