import { BaseResponse } from '../../../shared/infrastructure/http/base-response';
import { OperationalTaskResource } from '../resources/operational-task-resource';

export interface OperationalTaskResponse extends BaseResponse {
  content: OperationalTaskResource[];
}
