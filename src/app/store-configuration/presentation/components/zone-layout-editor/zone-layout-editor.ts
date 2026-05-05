import {
  Component, Input, Output, EventEmitter,
  HostListener, signal, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreZoneLayout } from '../../../domain/model/zone.entity';

interface DragState {
  zoneId: string;
  mode: 'move' | 'resize';
  startMouseX: number;
  startMouseY: number;
  startZoneX: number;
  startZoneY: number;
  startZoneWidth: number;
  startZoneHeight: number;
}

@Component({
  selector: 'app-zone-layout-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zone-layout-editor.html',
  styleUrls: ['./zone-layout-editor.css']
})
export class ZoneLayoutEditorComponent {
  @Input({ required: true }) set zones(value: StoreZoneLayout[]) {
    this._zones.set(value.map(z => ({ ...z })));
    this._originalZones = value.map(z => ({ ...z }));
  }
  @Output() save = new EventEmitter<StoreZoneLayout[]>();
  @Output() cancel = new EventEmitter<void>();

  readonly svgWidth = 920;
  readonly svgHeight = 460;
  readonly gridSnap = 10;
  readonly minZoneSize = 40;

  _zones = signal<StoreZoneLayout[]>([]);
  private _originalZones: StoreZoneLayout[] = [];
  private _drag: DragState | null = null;
  private _svgRect: DOMRect | null = null;

  hasMoved = signal(false);
  selectedId = signal<string | null>(null);

  zones$ = computed(() => this._zones());

  onMouseDown(zone: StoreZoneLayout, event: MouseEvent, svgEl: SVGSVGElement) {
    event.preventDefault();
    event.stopPropagation();
    this._svgRect = svgEl.getBoundingClientRect();
    const scaleX = this.svgWidth / this._svgRect.width;
    const scaleY = this.svgHeight / this._svgRect.height;

    this._drag = {
      zoneId: zone.id,
      mode: 'move',
      startMouseX: event.clientX * scaleX,
      startMouseY: event.clientY * scaleY,
      startZoneX: zone.x,
      startZoneY: zone.y,
      startZoneWidth: zone.width,
      startZoneHeight: zone.height
    };
    this.selectedId.set(zone.id);
  }

  onResizeMouseDown(zone: StoreZoneLayout, event: MouseEvent, svgEl: SVGSVGElement) {
    event.preventDefault();
    event.stopPropagation();
    this._svgRect = svgEl.getBoundingClientRect();
    const scaleX = this.svgWidth / this._svgRect.width;
    const scaleY = this.svgHeight / this._svgRect.height;

    this._drag = {
      zoneId: zone.id,
      mode: 'resize',
      startMouseX: event.clientX * scaleX,
      startMouseY: event.clientY * scaleY,
      startZoneX: zone.x,
      startZoneY: zone.y,
      startZoneWidth: zone.width,
      startZoneHeight: zone.height
    };
    this.selectedId.set(zone.id);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this._drag || !this._svgRect) return;

    const scaleX = this.svgWidth / this._svgRect.width;
    const scaleY = this.svgHeight / this._svgRect.height;
    const mouseX = event.clientX * scaleX;
    const mouseY = event.clientY * scaleY;

    const dx = mouseX - this._drag.startMouseX;
    const dy = mouseY - this._drag.startMouseY;

    this._zones.update(zones => zones.map(z => {
      if (z.id !== this._drag!.zoneId) return z;

      if (this._drag!.mode === 'move') {
        const rawX = this._drag!.startZoneX + dx;
        const rawY = this._drag!.startZoneY + dy;
        const x = Math.max(0, Math.min(this.svgWidth - z.width, this.snap(rawX)));
        const y = Math.max(0, Math.min(this.svgHeight - z.height - 20, this.snap(rawY)));
        return { ...z, x, y };
      } else {
        // resize mode
        const rawW = this._drag!.startZoneWidth + dx;
        const rawH = this._drag!.startZoneHeight + dy;
        const width = Math.max(this.minZoneSize, Math.min(this.svgWidth - z.x, this.snap(rawW)));
        const height = Math.max(this.minZoneSize, Math.min(this.svgHeight - z.y - 20, this.snap(rawH)));
        return { ...z, width, height };
      }
    }));

    this.hasMoved.set(true);
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this._drag = null;
  }

  private snap(value: number): number {
    return Math.round(value / this.gridSnap) * this.gridSnap;
  }

  onSave() {
    this.save.emit(this._zones());
  }

  onCancel() {
    this._zones.set(this._originalZones.map(z => ({ ...z })));
    this.hasMoved.set(false);
    this.cancel.emit();
  }

  getZoneIcon(type: string): string {
    switch (type) {
      case 'ACCESS':   return '🚪';
      case 'CHECKOUT': return '💰';
      case 'AISLE':    return '🛒';
      case 'SECTION':  return '📦';
      case 'PROMO':    return '⭐';
      default:         return '📍';
    }
  }

  getZoneColor(type: string): string {
    switch (type) {
      case 'ACCESS':   return '#6366f1';
      case 'CHECKOUT': return '#0ea5e9';
      case 'AISLE':    return '#8b5cf6';
      case 'SECTION':  return '#10b981';
      case 'PROMO':    return '#f59e0b';
      default:         return '#64748b';
    }
  }
}
