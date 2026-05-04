import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreZone } from '../../../application/store-configuration-store.service';
import { LucideAngularModule, MapPin, Wifi, WifiOff } from 'lucide-angular';

@Component({
  selector: 'app-zone-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './zone-card.html',
  styleUrls: ['./zone-card.css']
})
export class ZoneCardComponent {
  @Input({ required: true }) zone!: StoreZone;

  readonly MapPin = MapPin;
  readonly Wifi = Wifi;
  readonly WifiOff = WifiOff;
}
