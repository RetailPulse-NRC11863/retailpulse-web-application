import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, MapPin, Archive, CircleAlert, CircleCheckBig } from 'lucide-angular';
import { AssistedProduct } from '../../../domain/model/assisted-product';
import { PromotionCardComponent } from '../promotion-card/promotion-card';
import { TranslateModule } from '@ngx-translate/core';
import { DbTranslatePipe } from '../../../../shared/presentation/pipes/db-translate.pipe';

@Component({
  selector: 'app-product-result-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PromotionCardComponent, TranslateModule, DbTranslatePipe],
  templateUrl: './product-result-card.html',
  styleUrls: ['./product-result-card.css']
})
export class ProductResultCardComponent {
  @Input({ required: true }) product!: AssistedProduct;
  readonly MapPin = MapPin;
  readonly Archive = Archive;
  readonly CircleAlert = CircleAlert;
  readonly CircleCheckBig = CircleCheckBig;
}
