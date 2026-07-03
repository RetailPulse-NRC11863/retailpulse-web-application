import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AssistedProduct } from '../../../domain/model/assisted-product';
import { environment } from '../../../../../environments/environment';

interface LayoutZone {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

@Component({
  selector: 'app-product-location-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-location-map.html',
  styleUrls: ['./product-location-map.css']
})
export class ProductLocationMapComponent {
  @Input({ required: true }) product!: AssistedProduct;
  private http = inject(HttpClient);

  readonly baseGridSize = 50;
  zones: LayoutZone[] = [];

  ngOnInit(): void {
    if (this.product.layoutZones.length > 0) {
      this.zones = this.product.layoutZones.map(zone => ({
        id: String(zone.id),
        name: zone.name,
        type: zone.type,
        x: zone.x ?? 0,
        y: zone.y ?? 0,
        width: zone.width ?? 160,
        height: zone.height ?? 100
      }));
      return;
    }

    const params = this.product.storeId ? new HttpParams().set('storeId', this.product.storeId) : undefined;
    this.http.get<any[]>(`${environment.apiUrl}/zones`, { params }).subscribe({
      next: zones => {
        this.zones = zones.map(zone => ({
          id: String(zone.id),
          name: zone.name,
          type: zone.type,
          x: zone.x ?? 0,
          y: zone.y ?? 0,
          width: zone.width ?? 160,
          height: zone.height ?? 100
        }));
        if (!this.zones.length) {
          this.zones = [this.targetZoneFromProduct()];
        }
      },
      error: () => {
        this.zones = [this.targetZoneFromProduct()];
      }
    });
  }

  get markerX(): number {
    const zone = this.targetZone();
    return zone.x + zone.width / 2;
  }

  get markerY(): number {
    const zone = this.targetZone();
    return zone.y + zone.height / 2;
  }

  get viewBoxX(): number {
    return Math.min(...this.displayZones().map(zone => zone.x), 0) - 40;
  }

  get viewBoxY(): number {
    return Math.min(...this.displayZones().map(zone => zone.y), 0) - 50;
  }

  get viewBoxWidth(): number {
    const maxX = Math.max(...this.displayZones().map(zone => zone.x + zone.width), 920);
    return maxX - this.viewBoxX + 40;
  }

  get viewBoxHeight(): number {
    const maxY = Math.max(...this.displayZones().map(zone => zone.y + zone.height), 460);
    return maxY - this.viewBoxY + 60;
  }

  get viewBox(): string {
    return `${this.viewBoxX} ${this.viewBoxY} ${this.viewBoxWidth} ${this.viewBoxHeight}`;
  }

  get floorX(): number {
    return this.viewBoxX + 10;
  }

  get floorY(): number {
    return this.viewBoxY + 10;
  }

  get floorWidth(): number {
    return this.viewBoxWidth - 20;
  }

  get floorHeight(): number {
    return this.viewBoxHeight - 20;
  }

  displayZones(): LayoutZone[] {
    const target = this.targetZoneFromProduct();
    if (!this.zones.length) return [target];
    return this.zones.some(zone => this.isTargetZone(zone)) ? this.zones : [...this.zones, target];
  }

  targetZone(): LayoutZone {
    return this.displayZones().find(zone => this.isTargetZone(zone)) ?? this.targetZoneFromProduct();
  }

  isTargetZone(zone: LayoutZone): boolean {
    return String(zone.id) === String(this.product.zoneId) || zone.name === this.product.zoneName;
  }

  isEntrance(zone: LayoutZone): boolean {
    return zone.type === 'ENTRANCE';
  }

  verticalGridLines(): number[] {
    const start = Math.floor(this.viewBoxX / this.baseGridSize) * this.baseGridSize;
    const end = this.viewBoxX + this.viewBoxWidth;
    return this.range(start, end, this.baseGridSize);
  }

  horizontalGridLines(): number[] {
    const start = Math.floor(this.viewBoxY / this.baseGridSize) * this.baseGridSize;
    const end = this.viewBoxY + this.viewBoxHeight;
    return this.range(start, end, this.baseGridSize);
  }

  shelfLines(): number[] {
    return this.horizontalGridLines().filter(y => y > this.floorY + 80 && y < this.floorY + this.floorHeight - 40 && y % 100 === 0);
  }

  private targetZoneFromProduct(): LayoutZone {
    return {
      id: this.product.zoneId || 'target',
      name: this.product.zoneName,
      type: 'AISLE',
      x: this.product.zoneX,
      y: this.product.zoneY,
      width: this.product.zoneWidth,
      height: this.product.zoneHeight
    };
  }

  private range(start: number, end: number, step: number): number[] {
    const values: number[] = [];
    for (let value = start; value <= end; value += step) {
      values.push(value);
    }
    return values;
  }
}
