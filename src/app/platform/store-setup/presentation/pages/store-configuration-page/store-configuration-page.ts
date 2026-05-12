import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreConfigurationStore } from '../../../application/store-configuration-store.service';
import { TrafficZone } from '../../../../../traffic-analytics/domain/model/traffic-zone.entity';
import { InventoryItem } from '../../../../../inventory-intelligence/domain/model/inventory-item.entity';
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
  Pencil,
  DoorClosed,
  CreditCard,
  ShoppingCart,
  Package,
  Star,
  MapPin
} from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';

type ZoneType = 'ACCESS' | 'CHECKOUT' | 'AISLE' | 'SECTION' | 'PROMO';

const ZONE_DEFAULTS: Record<ZoneType, { width: number; height: number }> = {
  ACCESS:   { width: 180, height: 80 },
  CHECKOUT: { width: 160, height: 80 },
  AISLE:    { width: 280, height: 100 },
  SECTION:  { width: 280, height: 100 },
  PROMO:    { width: 460, height: 80 }
};

const CANVAS_WIDTH = 920;
const CANVAS_HEIGHT = 460;
const GRID_SNAP = 10;
const ZONE_PADDING = 10;

@Component({
  selector: 'app-store-configuration-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent,
    ZoneLayoutEditorComponent,
    LucideAngularModule,
    TranslateModule
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
  readonly PencilIcon  = Pencil;

  readonly zoneIcons: Record<string, any> = {
    ACCESS:   DoorClosed,
    CHECKOUT: CreditCard,
    AISLE:    ShoppingCart,
    SECTION:  Package,
    PROMO:    Star,
  };
  readonly defaultZoneIcon = MapPin;

  readonly zoneTypes: ZoneType[] = ['ACCESS', 'CHECKOUT', 'AISLE', 'SECTION', 'PROMO'];

  // --- UI state signals ---
  showAddForm        = signal(false);
  showAddProductForm = signal(false);
  editMode           = signal(false);
  confirmDelete      = signal<string | null>(null);
  confirmDeleteProduct = signal<string | null>(null);

  // Edit zone
  editingZoneId = signal<string | null>(null);

  // Edit product
  editingProductId = signal<string | null>(null);

  // --- Add Zone form fields ---
  newZoneName = '';
  newZoneType: ZoneType = 'AISLE';
  newZoneTraffic = 0;
  newZoneDwell = 0;
  newZoneConversion = 0;
  newZoneIntensity = 0;

  // --- Edit Zone form fields ---
  editZoneName = '';
  editZoneType: ZoneType = 'AISLE';
  editZoneTraffic = 0;
  editZoneDwell = 0;
  editZoneConversion = 0;
  editZoneIntensity = 0;

  // --- Add Product form fields ---
  newProductName = '';
  newProductCategory = '';
  newProductPrice = 0;
  newProductStock = 0;
  newProductZone = '';
  newProductShelf = '';
  newProductPromotion = '';

  // --- Edit Product form fields ---
  editProductName = '';
  editProductCategory = '';
  editProductPrice = 0;
  editProductStock = 0;
  editProductZone = '';
  editProductShelf = '';
  editProductPromotion = '';

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

  // --- Auto-position logic ---
  private findAvailablePosition(width: number, height: number): { x: number; y: number } {
    const existingZones = this.store.zones();
    const step = GRID_SNAP;

    for (let y = ZONE_PADDING; y + height <= CANVAS_HEIGHT - ZONE_PADDING; y += step) {
      for (let x = ZONE_PADDING; x + width <= CANVAS_WIDTH - ZONE_PADDING; x += step) {
        const candidate = { x, y, width, height };
        const overlaps = existingZones.some(z =>
          candidate.x < z.x + z.width + ZONE_PADDING &&
          candidate.x + candidate.width + ZONE_PADDING > z.x &&
          candidate.y < z.y + z.height + ZONE_PADDING &&
          candidate.y + candidate.height + ZONE_PADDING > z.y
        );
        if (!overlaps) {
          return { x, y };
        }
      }
    }
    // fallback: place at bottom
    return { x: ZONE_PADDING, y: ZONE_PADDING };
  }

  // --- Add Zone ---
  submitAddZone() {
    if (!this.newZoneName.trim()) return;
    const defaults = ZONE_DEFAULTS[this.newZoneType];
    const pos = this.findAvailablePosition(defaults.width, defaults.height);
    const zone: Omit<TrafficZone, 'id'> = {
      name: this.newZoneName.trim(),
      type: this.newZoneType,
      x: pos.x,
      y: pos.y,
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

  // --- Edit Zone ---
  startEditZone(zone: TrafficZone) {
    this.editingZoneId.set(zone.id);
    this.editZoneName = zone.name;
    this.editZoneType = zone.type as ZoneType;
    this.editZoneTraffic = 0;
    this.editZoneDwell = 0;
    this.editZoneConversion = 0;
    this.editZoneIntensity = 0;
    this.showAddForm.set(false);
  }

  cancelEditZone() {
    this.editingZoneId.set(null);
  }

  submitEditZone() {
    const zoneId = this.editingZoneId();
    if (!zoneId || !this.editZoneName.trim()) return;

    const updates: Partial<TrafficZone> = {
      name: this.editZoneName.trim(),
      type: this.editZoneType
    };
    const metricsData = {
      traffic: this.editZoneTraffic,
      averageDwellTimeSeconds: this.editZoneDwell,
      conversionRate: this.editZoneConversion,
      intensity: this.editZoneIntensity
    };
    this.store.updateZone(zoneId, updates, metricsData);
    this.editingZoneId.set(null);
  }

  // --- Add Product ---
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

  // --- Edit Product ---
  startEditProduct(product: InventoryItem) {
    this.editingProductId.set(product.id);
    this.editProductName = product.name;
    this.editProductCategory = product.category;
    this.editProductPrice = product.price;
    this.editProductStock = product.stock;
    this.editProductZone = product.zoneName;
    this.editProductShelf = product.shelfReference;
    this.editProductPromotion = product.promotion || '';
    this.showAddProductForm.set(false);
  }

  cancelEditProduct() {
    this.editingProductId.set(null);
  }

  submitEditProduct() {
    const productId = this.editingProductId();
    if (!productId || !this.editProductName.trim()) return;

    this.store.updateProduct(productId, {
      name: this.editProductName.trim(),
      category: this.editProductCategory.trim() || 'Uncategorized',
      price: this.editProductPrice,
      stock: this.editProductStock,
      zoneName: this.editProductZone.trim() || 'Unassigned',
      shelfReference: this.editProductShelf.trim(),
      promotion: this.editProductPromotion.trim() || null
    } as any);
    this.editingProductId.set(null);
  }

  // --- Delete ---
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
