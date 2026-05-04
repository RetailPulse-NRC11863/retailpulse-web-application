import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreConfigurationStore } from '../../../application/store-configuration-store.service';
import { ZoneCardComponent } from '../../components/zone-card/zone-card';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { LucideAngularModule, Store, Map, PackageSearch } from 'lucide-angular';

@Component({
  selector: 'app-store-configuration-page',
  standalone: true,
  imports: [
    CommonModule,
    ZoneCardComponent,
    ProductCardComponent,
    LucideAngularModule
  ],
  templateUrl: './store-configuration-page.html',
  styleUrls: ['./store-configuration-page.css']
})
export class StoreConfigurationPageComponent implements OnInit {
  store = inject(StoreConfigurationStore);

  readonly StoreIcon = Store;
  readonly MapIcon = Map;
  readonly PackageSearch = PackageSearch;

  ngOnInit() {
    this.store.loadStoreData();
  }
}
