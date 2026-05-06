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

  markAsCompleted(): void {
    this.status = 'RESOLVED';
  }

  isPending(): boolean {
    return this.status === 'PENDING';
  }

  isOverdue(): boolean {
    const ageInHours = (new Date().getTime() - this.createdAt.getTime()) / (1000 * 60 * 60);
    if (this.priority === 'HIGH' && ageInHours > 1) return true;
    if (this.priority === 'MEDIUM' && ageInHours > 4) return true;
    if (this.priority === 'LOW' && ageInHours > 24) return true;
    return false;
  }
}
