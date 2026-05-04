import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../../shared/infrastructure/http/base-endpoint';
import { Alert } from '../../domain/model/alert.entity';
import { AlertResource } from '../resources/alert-resource';
import { AlertResponse } from '../responses/alert-response';
import { AlertAssembler } from '../assemblers/alert-assembler';

@Injectable({
  providedIn: 'root'
})
export class AlertsApiService extends BaseApiEndpoint<
  Alert,
  AlertResource,
  AlertResponse,
  AlertAssembler
> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/v1/alerts', new AlertAssembler());
  }

  // Inherits getAll, getById, create, update, delete from BaseApiEndpoint
}
