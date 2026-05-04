import { Injectable } from '@angular/core';
import { BaseApi } from '../../../shared/infrastructure/http/base-api';
import { AlertsApiService } from './alerts-api.service';
import { OperationalTasksApiService } from './operational-tasks-api.service';
import { Observable } from 'rxjs';
import { Alert } from '../../domain/model/alert.entity';
import { OperationalTask } from '../../domain/model/operational-task.entity';

@Injectable({
  providedIn: 'root'
})
export class AlertsRecommendationsApiService extends BaseApi {
  constructor(
    private alertsApi: AlertsApiService,
    private tasksApi: OperationalTasksApiService
  ) {
    super();
  }

  /**
   * Obtener alertas activas
   */
  getActiveAlerts(): Observable<Alert[]> {
    // In a real scenario, you might pass query params to getAll
    // For now, it fetches all alerts from json-server
    return this.alertsApi.getAll();
  }

  /**
   * Obtener tareas operativas
   */
  getOperationalTasks(): Observable<OperationalTask[]> {
    return this.tasksApi.getAll();
  }

  /**
   * Actualizar el estado visual de una tarea
   */
  updateTaskStatus(taskId: string, status: string): Observable<OperationalTask> {
    return this.tasksApi.updateTaskStatus(taskId, status);
  }
}
