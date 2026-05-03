import { ProductResult } from '../../domain/model/product-result';

export class ProductResultAssembler {
  static fromDto(dto: any): ProductResult {
    return {
      id: dto.id,
      name: dto.name,
      category: dto.category,
      price: dto.price,
      stock: dto.stock,
      zoneName: dto.zoneName,
      shelfReference: dto.shelfReference,
      promotion: dto.promotion || null
    };
  }

  static fromDtoList(dtos: any[]): ProductResult[] {
    return dtos.map(dto => this.fromDto(dto));
  }
}
