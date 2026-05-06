import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZoneWithMetric } from '../../../application/traffic-analytics-store.service';
import {LucideAngularModule, DoorClosed, CreditCard, ShoppingCart, Package, Star, MapPin} from 'lucide-angular';

@Component({
  selector: 'app-store-heatmap',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './store-heatmap.html',
  styleUrls: ['./store-heatmap.css']
})
export class StoreHeatmapComponent {
  @Input({ required: true }) zonesWithMetrics: ZoneWithMetric[] = [];
  @Input() selectedZoneId: string | null = null;
  @Output() zoneSelected = new EventEmitter<string>();
  @ViewChild('heatmapContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  hoveredZoneId: string | null = null;
  tooltipX = 0;
  tooltipY = 0;

  readonly svgWidth = 920;
  readonly svgHeight = 460;

  private readonly tooltipWidth = 220;
  private readonly tooltipHeight = 180;

  onZoneClick(zoneId: string) {
    this.zoneSelected.emit(zoneId);
  }

  onZoneMouseEnter(zoneId: string, event: MouseEvent) {
    this.hoveredZoneId = zoneId;
    const container = this.containerRef.nativeElement;
    const rect = container.getBoundingClientRect();

    let x = event.clientX - rect.left + 14;
    let y = event.clientY - rect.top - 10;

    // Clamp tooltip within container bounds
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    // If tooltip would overflow right, flip to left side of cursor
    if (x + this.tooltipWidth > containerWidth) {
      x = event.clientX - rect.left - this.tooltipWidth - 14;
    }

    // If tooltip would overflow bottom, move it up
    if (y + this.tooltipHeight > containerHeight) {
      y = containerHeight - this.tooltipHeight - 8;
    }

    // Ensure tooltip doesn't go above or to the left
    if (x < 8) x = 8;
    if (y < 8) y = 8;

    this.tooltipX = x;
    this.tooltipY = y;
  }

  onZoneMouseLeave() {
    this.hoveredZoneId = null;
  }

  getHoveredDetail(): ZoneWithMetric | null {
    if (!this.hoveredZoneId) return null;
    return this.zonesWithMetrics.find(z => z.zone.id === this.hoveredZoneId) || null;
  }

  getColorForIntensity(intensity: number): string {
    if (intensity >= 81) return '#ef4444';
    if (intensity >= 61) return '#f97316';
    if (intensity >= 41) return '#eab308';
    if (intensity >= 21) return '#22c55e';
    return '#3b82f6';
  }

  getZoneOpacity(intensity: number): number {
    return 0.6 + (intensity / 100) * 0.4;
  }

  getZoneIcon(type: string): any {
    const icons: Record<string, any> = {
      ACCESS:   DoorClosed,
      CHECKOUT: CreditCard,
      AISLE:    ShoppingCart,
      SECTION:  Package,
      PROMO:    Star,
    };
    return icons[type] ?? MapPin;
  }

  getIntensityLabel(intensity: number): string {
    if (intensity >= 81) return 'Very High';
    if (intensity >= 61) return 'High';
    if (intensity >= 41) return 'Medium-High';
    if (intensity >= 21) return 'Medium';
    return 'Low';
  }
}
