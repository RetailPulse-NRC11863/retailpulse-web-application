import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreProduct } from '../../../application/store-configuration-store.service';
import { LucideAngularModule, Package, Layers, Tag } from 'lucide-angular';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCardComponent {
  @Input({ required: true }) product!: StoreProduct;

  readonly Package = Package;
  readonly Layers = Layers;
  readonly Tag = Tag;
}
