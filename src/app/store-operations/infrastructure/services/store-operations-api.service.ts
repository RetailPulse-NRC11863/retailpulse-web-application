import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationalAlert } from '../../domain/model/operational-alert.entity';
import { OperationalTask } from '../../domain/model/operational-task.entity';
import { OperationalAlertsApiService } from './operational-alerts-api.service';
import { OperationalTasksApiService } from './operational-tasks-api.service';

@Injectable({ providedIn: 'root' })
export class StoreOperationsApiService {
  private alertsService = inject(OperationalAlertsApiService);
  private tasksService = inject(OperationalTasksApiService);

  getAlerts(): Observable<OperationalAlert[]> {
    return this.alertsService.getAll();
  }

  getTasks(): Observable<OperationalTask[]> {
    return this.tasksService.getAll();
  }
}
