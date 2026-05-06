import { BaseResource } from '../../../shared/infrastructure/http/base-response';

export interface OperationalTaskResource extends BaseResource {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  zoneId: string;
  zoneName: string;
  alertId: string;
  createdAt: string;
}
