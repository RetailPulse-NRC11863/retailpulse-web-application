import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Alert implements BaseEntity {
  id: string;
  type: string;
  priority: string;
  status: string;
  message: string;
  zoneId: string;
  zoneName: string;
  productId: string;
  productName: string;
  createdAt: Date;

  constructor(data: {
    id: string;
    type: string;
    priority: string;
    status: string;
    message: string;
    zoneId: string;
    zoneName: string;
    productId: string;
    productName: string;
    createdAt: Date | string;
  }) {
    this.id = data.id;
    this.type = data.type;
    this.priority = data.priority;
    this.status = data.status;
    this.message = data.message;
    this.zoneId = data.zoneId;
    this.zoneName = data.zoneName;
    this.productId = data.productId;
    this.productName = data.productName;
    this.createdAt = new Date(data.createdAt);
  }
}
