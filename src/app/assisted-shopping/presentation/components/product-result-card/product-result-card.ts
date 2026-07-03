import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, MapPin, Archive, CircleAlert, CircleCheckBig, Check, HandHelping } from 'lucide-angular';
import { AssistedProduct } from '../../../domain/model/assisted-product';
import { PromotionCardComponent } from '../promotion-card/promotion-card';
import { ProductLocationMapComponent } from '../product-location-map/product-location-map';
import { TranslateModule } from '@ngx-translate/core';
import { DbTranslatePipe } from '../../../../shared/presentation/pipes/db-translate.pipe';

@Component({
  selector: 'app-product-result-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PromotionCardComponent, ProductLocationMapComponent, TranslateModule, DbTranslatePipe],
  templateUrl: './product-result-card.html',
  styleUrls: ['./product-result-card.css']
})
export class ProductResultCardComponent {
  @Input({ required: true }) product!: AssistedProduct;
  @Input() loadingAction = false;
  @Input() showLocationMap = false;
  @Output() locationViewed = new EventEmitter<AssistedProduct>();
  @Output() found = new EventEmitter<AssistedProduct>();
  @Output() helpRequested = new EventEmitter<AssistedProduct>();
  readonly MapPin = MapPin;
  readonly Archive = Archive;
  readonly CircleAlert = CircleAlert;
  readonly CircleCheckBig = CircleCheckBig;
  readonly Check = Check;
  readonly HandHelping = HandHelping;

  toggleLocationMap() {
    this.locationViewed.emit(this.product);
  }
}
