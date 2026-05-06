import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreConfigurationStore } from '../../../application/store-configuration-store.service';
import { TrafficZone } from '../../../../../traffic-analytics/domain/model/traffic-zone.entity';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { ZoneLayoutEditorComponent } from '../../components/zone-layout-editor/zone-layout-editor';
import {
  LucideAngularModule,
  Store,
  Map,
  PackageSearch,
  Plus,
  Trash2,
  PencilRuler,
  DoorClosed,
  CreditCard,
  ShoppingCart,
  Package,
  Star,
  MapPin
} from 'lucide-angular';

type ZoneType = 'ACCESS' | 'CHECKOUT' | 'AISLE' | 'SECTION' | 'PROMO';

const ZONE_DEFAULTS: Record<ZoneType, { width: number; height: number }> = {
  ACCESS:   { width: 180, height: 80 },
  CHECKOUT: { width: 160, height: 80 },
  AISLE:    { width: 280, height: 100 },
  SECTION:  { width: 280, height: 100 },
  PROMO:    { width: 460, height: 80 }
};

@Component({
  selector: 'app-store-configuration-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent,
    ZoneLayoutEditorComponent,
    LucideAngularModule
  ],
  templateUrl: './store-configuration-page.html',
  styleUrls: ['./store-configuration-page.css']
})
export class StoreConfigurationPageComponent implements OnInit {
  store = inject(StoreConfigurationStore);

  readonly StoreIcon   = Store;
  readonly MapIcon     = Map;
  readonly PackageIcon = PackageSearch;
  readonly PlusIcon    = Plus;
  readonly TrashIcon   = Trash2;
  readonly EditIcon    = PencilRuler;

  readonly zoneIcons: Record<string, any> = {
    ACCESS:   DoorClosed,
    CHECKOUT: CreditCard,
    AISLE:    ShoppingCart,
    SECTION:  Package,
    PROMO:    Star,
  };
  readonly defaultZoneIcon = MapPin;

  readonly zoneTypes: ZoneType[] = ['ACCESS', 'CHECKOUT', 'AISLE', 'SECTION', 'PROMO'];

  showAddForm   = signal(false);
  showAddProductForm = signal(false);
  editMode      = signal(false);
  confirmDelete = signal<string | null>(null);
  confirmDeleteProduct = signal<string | null>(null);

  newZoneName = '';
  newZoneType: ZoneType = 'AISLE';
  newZoneTraffic = 0;
  newZoneDwell = 0;
  newZoneConversion = 0;
  newZoneIntensity = 0;

  newProductName = '';
  newProductCategory = '';
  newProductPrice = 0;
  newProductStock = 0;
  newProductZone = '';
  newProductShelf = '';
  newProductPromotion = '';

  ngOnInit() {
    this.store.loadStoreData();
  }

  getZoneIcon(type: string): any {
    return this.zoneIcons[type] ?? this.defaultZoneIcon;
  }

  getZoneTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      ACCESS: 'Entrance/Exit', CHECKOUT: 'Checkout',
      AISLE: 'Aisle', SECTION: 'Product Section', PROMO: 'Promotional'
    };
    return labels[type] ?? type;
  }

  submitAddZone() {
    if (!this.newZoneName.trim()) return;
    const defaults = ZONE_DEFAULTS[this.newZoneType];
    const zone: Omit<TrafficZone, 'id'> = {
      name: this.newZoneName.trim(),
      type: this.newZoneType,
      x: 20,
      y: 20,
      width: defaults.width,
      height: defaults.height
    };
    const metricsData = {
      traffic: this.newZoneTraffic,
      averageDwellTimeSeconds: this.newZoneDwell,
      conversionRate: this.newZoneConversion,
      intensity: this.newZoneIntensity
    };
    this.store.addZone(zone, metricsData);
    this.newZoneName = '';
    this.newZoneType = 'AISLE';
    this.newZoneTraffic = 0;
    this.newZoneDwell = 0;
    this.newZoneConversion = 0;
    this.newZoneIntensity = 0;
    this.showAddForm.set(false);
  }

  submitAddProduct() {
    if (!this.newProductName.trim()) return;
    this.store.addProduct({
      name: this.newProductName.trim(),
      category: this.newProductCategory.trim() || 'Uncategorized',
      price: this.newProductPrice,
      stock: this.newProductStock,
      zoneName: this.newProductZone.trim() || 'Unassigned',
      shelfReference: this.newProductShelf.trim(),
      promotion: this.newProductPromotion.trim() || null
    });
    this.newProductName = '';
    this.newProductCategory = '';
    this.newProductPrice = 0;
    this.newProductStock = 0;
    this.newProductZone = '';
    this.newProductShelf = '';
    this.newProductPromotion = '';
    this.showAddProductForm.set(false);
  }

  requestDelete(zoneId: string) {
    this.confirmDelete.set(zoneId);
  }

  confirmDeleteZone() {
    const id = this.confirmDelete();
    if (id) {
      this.store.deleteZone(id);
      this.confirmDelete.set(null);
    }
  }

  requestDeleteProduct(productId: string) {
    this.confirmDeleteProduct.set(productId);
  }

  confirmDeleteProductAction() {
    const id = this.confirmDeleteProduct();
    if (id) {
      this.store.deleteProduct(id);
      this.confirmDeleteProduct.set(null);
    }
  }

  onSaveLayout(zones: TrafficZone[]) {
    this.store.saveZoneLayout(zones);
    this.editMode.set(false);
  }

  onCancelEdit() {
    this.store.loadStoreData();
    this.editMode.set(false);
  }
}
