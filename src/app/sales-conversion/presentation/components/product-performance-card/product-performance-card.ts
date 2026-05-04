import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPerformance } from '../../../domain/model/product-performance.entity';
import { LucideAngularModule, Package, ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-product-performance-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './product-performance-card.html',
  styleUrls: ['./product-performance-card.css']
})
export class ProductPerformanceCardComponent {
  @Input({ required: true }) product!: ProductPerformance;

  readonly Package = Package;
  readonly ArrowUpRight = ArrowUpRight;
  readonly ArrowDownRight = ArrowDownRight;
  readonly AlertCircle = AlertCircle;
}
