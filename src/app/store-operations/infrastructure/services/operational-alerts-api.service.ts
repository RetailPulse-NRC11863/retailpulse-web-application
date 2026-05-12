import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../../shared/infrastructure/http/base-endpoint';
import { OperationalAlert } from '../../domain/model/operational-alert.entity';
import { OperationalAlertResource } from '../resources/operational-alert-resource';
import { OperationalAlertResponse } from '../responses/operational-alert-response';
import { OperationalAlertAssembler } from '../assemblers/operational-alert-assembler';

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
    super(http, 'http://localhost:3000/api/v1/alerts', new OperationalAlertAssembler());
  }
}
