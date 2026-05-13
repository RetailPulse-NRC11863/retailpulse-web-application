import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../../shared/infrastructure/http/base-endpoint';
import { OperationalTask } from '../../domain/model/operational-task.entity';
import { OperationalTaskResource } from '../resources/operational-task-resource';
import { OperationalTaskResponse } from '../responses/operational-task-response';
import { OperationalTaskAssembler } from '../assemblers/operational-task-assembler';
import { Observable, map, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperationalTasksApiService extends BaseApiEndpoint<
  OperationalTask,
  OperationalTaskResource,
  OperationalTaskResponse,
  OperationalTaskAssembler
> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/operationalTasks`, new OperationalTaskAssembler());
  }

  /**
   * Updates the visual status of an operational task.
   */
  updateTaskStatus(taskId: string, status: string): Observable<OperationalTask> {
    return this.http.patch<OperationalTaskResource>(`${this.endpointUrl}/${taskId}`, { status }).pipe(
      map(updated => this.assembler.toEntityFromResource(updated)),
      catchError(this.handleError('Failed to update task status'))
    );
  }

  // Inherits getAll, getById, create, update, delete from BaseApiEndpoint
}
