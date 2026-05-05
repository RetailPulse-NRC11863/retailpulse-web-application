import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class StoreZoneLayout implements BaseEntity {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;

  constructor(data: {
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.x = data.x;
    this.y = data.y;
    this.width = data.width;
    this.height = data.height;
    this.type = data.type;
  }
}
