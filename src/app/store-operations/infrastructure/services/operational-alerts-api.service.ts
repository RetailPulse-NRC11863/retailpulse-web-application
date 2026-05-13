import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../../shared/infrastructure/http/base-endpoint';
import { OperationalAlert } from '../../domain/model/operational-alert.entity';
import { OperationalAlertResource } from '../resources/operational-alert-resource';
import { OperationalAlertResponse } from '../responses/operational-alert-response';
import { OperationalAlertAssembler } from '../assemblers/operational-alert-assembler';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperationalAlertsApiService extends BaseApiEndpoint<
  OperationalAlert,
  OperationalAlertResource,
  OperationalAlertResponse,
  OperationalAlertAssembler
> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/alerts`, new OperationalAlertAssembler());
  }
}
