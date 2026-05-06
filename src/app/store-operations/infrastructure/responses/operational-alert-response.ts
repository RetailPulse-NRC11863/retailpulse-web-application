import {BaseResponse} from '../../../shared/infrastructure/http/base-response';
import {OperationalAlertResource} from '../resources/operational-alert-resource';

export interface OperationalAlertResponse extends BaseResponse {
  content: OperationalAlertResource[];
}
