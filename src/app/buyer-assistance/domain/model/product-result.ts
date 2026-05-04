import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * Domain entity representing a product result in the buyer-assistance context.
 */
export class ProductResult implements BaseEntity {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  zoneName: string;
  shelfReference: string;
  promotion: string | null;

  constructor(data: {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    zoneName: string;
    shelfReference: string;
    promotion: string | null;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.category = data.category;
    this.price = data.price;
    this.stock = data.stock;
    this.zoneName = data.zoneName;
    this.shelfReference = data.shelfReference;
    this.promotion = data.promotion;
  }
}
