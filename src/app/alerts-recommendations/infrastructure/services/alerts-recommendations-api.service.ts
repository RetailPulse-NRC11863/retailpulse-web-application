import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertsApiService } from './alerts-api.service';
import { OperationalTasksApiService } from './operational-tasks-api.service';
import { Alert } from '../../domain/model/alert.entity';
import { OperationalTask } from '../../domain/model/operational-task.entity';
import { Recommendation } from '../../domain/model/recommendation.entity';
import { BaseApiEndpoint } from '../../../shared/infrastructure/http/base-endpoint';
import { RecommendationResource } from '../resources/recommendation-resource';
import { RecommendationResponse } from '../responses/recommendation-response';
import { RecommendationAssembler } from '../assemblers/recommendation-assembler';

@Injectable({ providedIn: 'root' })
export class RecommendationsApiService extends BaseApiEndpoint<Recommendation, RecommendationResource, RecommendationResponse, RecommendationAssembler> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/v1/recommendations', new RecommendationAssembler());
  }
}

@Injectable({
  providedIn: 'root'
})
export class AlertsRecommendationsApiService {
  private alertsService = inject(AlertsApiService);
  private tasksService = inject(OperationalTasksApiService);
  private recommendationsService = inject(RecommendationsApiService);

  getActiveAlerts(): Observable<Alert[]> {
    return this.alertsService.getAll();
  }

  getOperationalTasks(): Observable<OperationalTask[]> {
    return this.tasksService.getAll();
  }

  updateTaskStatus(taskId: string, status: string): Observable<OperationalTask> {
    return this.tasksService.updateTaskStatus(taskId, status);
  }

  getRecommendations(): Observable<Recommendation[]> {
    return this.recommendationsService.getAll();
  }
}
