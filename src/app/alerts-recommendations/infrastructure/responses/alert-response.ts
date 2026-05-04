import { BaseResponse } from '../../../shared/infrastructure/http/base-response';
import { AlertResource } from '../resources/alert-resource';

export interface AlertResponse extends BaseResponse {
  content: AlertResource[];
}
