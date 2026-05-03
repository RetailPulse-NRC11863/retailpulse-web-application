import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, MapPin, Archive, CircleAlert, CircleCheckBig } from 'lucide-angular';
import { ProductResult } from '../../../domain/model/product-result';
import { PromotionCardComponent } from '../promotion-card/promotion-card';

@Component({
  selector: 'app-product-result-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PromotionCardComponent],
  templateUrl: './product-result-card.html',
  styleUrls: ['./product-result-card.css']
})
export class ProductResultCardComponent {
  @Input({ required: true }) product!: ProductResult;
  readonly MapPin = MapPin;
  readonly Archive = Archive;
  readonly CircleAlert = CircleAlert;
  readonly CircleCheckBig = CircleCheckBig;
}
