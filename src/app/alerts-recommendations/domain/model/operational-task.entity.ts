import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class OperationalTask implements BaseEntity {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  zoneId: string;
  zoneName: string;
  alertId: string;
  createdAt: Date;

  constructor(data: {
    id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    zoneId: string;
    zoneName: string;
    alertId: string;
    createdAt: Date | string;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.priority = data.priority;
    this.status = data.status;
    this.zoneId = data.zoneId;
    this.zoneName = data.zoneName;
    this.alertId = data.alertId;
    this.createdAt = new Date(data.createdAt);
  }
}
