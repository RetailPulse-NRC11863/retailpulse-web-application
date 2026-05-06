import {BaseResource} from '../../../shared/infrastructure/http/base-response';

export interface OperationalAlertResource extends BaseResource {
  id: string;
  type: string;
  priority: string;
  status: string;
  message: string;
  zoneId: string;
  zoneName: string;
  productId: string;
  productName: string;
  createdAt: string;
}
