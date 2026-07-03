import { BaseEntity } from '../../../shared/domain/model/base-entity';

export interface AssistedProductLayoutZone {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class AssistedProduct implements BaseEntity {
  id: string;
  storeId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  stockStatus: string;
  zoneName: string;
  zoneId: string;
  shelfReference: string;
  aisle: string | null;
  shelf: string | null;
  displayReference: string | null;
  promotion: string | null;
  zoneX: number;
  zoneY: number;
  zoneWidth: number;
  zoneHeight: number;
  layoutZones: AssistedProductLayoutZone[];

  constructor(data: {
    id: string;
    storeId?: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    stockStatus?: string;
    zoneName: string;
    zoneId?: string;
    shelfReference: string;
    aisle?: string | null;
    shelf?: string | null;
    displayReference?: string | null;
    promotion: string | null;
    zoneX?: number;
    zoneY?: number;
    zoneWidth?: number;
    zoneHeight?: number;
    layoutZones?: AssistedProductLayoutZone[];
  }) {
    this.id = data.id;
    this.storeId = data.storeId || '';
    this.name = data.name;
    this.category = data.category;
    this.price = data.price;
    this.stock = data.stock;
    this.stockStatus = data.stockStatus || (data.stock <= 0 ? 'OUT_OF_STOCK' : 'AVAILABLE');
    this.zoneName = data.zoneName;
    this.zoneId = data.zoneId || '';
    this.shelfReference = data.shelfReference;
    this.aisle = data.aisle || null;
    this.shelf = data.shelf || null;
    this.displayReference = data.displayReference || null;
    this.promotion = data.promotion;
    this.zoneX = data.zoneX ?? 0;
    this.zoneY = data.zoneY ?? 0;
    this.zoneWidth = data.zoneWidth ?? 160;
    this.zoneHeight = data.zoneHeight ?? 100;
    this.layoutZones = data.layoutZones || [];
  }

  isAvailable(): boolean {
    return this.stock > 0;
  }

  isLowStock(): boolean {
    return this.stockStatus === 'LOW_STOCK';
  }

  hasPromotion(): boolean {
    return this.promotion !== null;
  }

  isLocatedIn(zoneName: string): boolean {
    return this.zoneName === zoneName;
  }
}
