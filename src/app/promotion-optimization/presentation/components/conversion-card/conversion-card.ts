import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversionGap } from '../../../domain/model/conversion-gap.entity';
import { LucideAngularModule, Activity, ShoppingBag, TrendingUp, MapPin } from 'lucide-angular';

@Component({
  selector: 'app-conversion-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './conversion-card.html',
  styleUrls: ['./conversion-card.css']
})
export class ConversionCardComponent {
  @Input({ required: true }) metric!: ConversionGap;
  @Input() zoneName: string = '';

  readonly Activity = Activity;
  readonly ShoppingBag = ShoppingBag;
  readonly TrendingUp = TrendingUp;
  readonly MapPin = MapPin;
}
