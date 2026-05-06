import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class OperationalAlert implements BaseEntity {
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
  assignedStaffId: string | null = null;

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

  escalate(): void {
    if (this.priority === 'LOW') this.priority = 'MEDIUM';
    else if (this.priority === 'MEDIUM') this.priority = 'HIGH';
    else if (this.priority === 'HIGH') this.priority = 'CRITICAL';
  }

  resolve(): void {
    this.status = 'RESOLVED';
  }

  isCritical(): boolean {
    return this.priority === 'HIGH' || this.priority === 'CRITICAL';
  }

  assignToStaff(staffId: string): void {
    this.assignedStaffId = staffId;
    if (this.status === 'PENDING') {
      this.status = 'IN_PROGRESS';
    }
  }

  isResolved(): boolean {
    return this.status === 'RESOLVED';
  }
}
