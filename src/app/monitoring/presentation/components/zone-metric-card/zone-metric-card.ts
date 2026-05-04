import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZoneMetric } from '../../../domain/model/zone-metric.entity';
import { ConversionMetric } from '../../../../sales-conversion/domain/model/conversion-metric.entity';
import { LucideAngularModule, MapPin, Users, Clock, ShoppingCart } from 'lucide-angular';

@Component({
  selector: 'app-zone-metric-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './zone-metric-card.html',
  styleUrls: ['./zone-metric-card.css']
})
export class ZoneMetricCardComponent {
  @Input({ required: true }) zone!: ZoneMetric;
  @Input() conversion?: ConversionMetric;

  readonly MapPin = MapPin;
  readonly Users = Users;
  readonly Clock = Clock;
  readonly ShoppingCart = ShoppingCart;

  get formattedDwellTime(): string {
    const mins = Math.floor(this.zone.averageDwellTimeSeconds / 60);
    const secs = this.zone.averageDwellTimeSeconds % 60;
    return `${mins}m ${secs}s`;
  }
}
