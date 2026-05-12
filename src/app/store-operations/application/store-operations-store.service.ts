import { Injectable, signal, computed, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { OperationalAlert } from '../domain/model/operational-alert.entity';
import { OperationalTask } from '../domain/model/operational-task.entity';
import { StoreOperationsApiService } from '../infrastructure/services/store-operations-api.service';
import { OperationalTasksApiService } from '../infrastructure/services/operational-tasks-api.service';

export interface StoreOperationsState {
  alerts: OperationalAlert[];
  tasks: OperationalTask[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class StoreOperationsStore {
  private api = inject(StoreOperationsApiService);
  private tasksApi = inject(OperationalTasksApiService);

  private state = signal<StoreOperationsState>({
    alerts: [],
    tasks: [],
    loading: false,
    error: null
  });

  alerts = computed(() => this.state().alerts);
  tasks = computed(() => this.state().tasks);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  highPriorityAlerts = computed(() => 
    this.alerts().filter(a => a.priority === 'HIGH' || a.priority === 'CRITICAL')
  );

  activeAlerts = computed(() => 
    this.alerts().filter(a => a.status !== 'RESOLVED')
  );

  pendingTasks = computed(() => 
    this.tasks().filter(t => t.status === 'PENDING')
  );

  loadOperationsData() {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    forkJoin({
      alerts: this.api.getAlerts(),
      tasks: this.api.getTasks()
    }).subscribe({
      next: (data) => {
        this.state.update(s => ({
          ...s,
          ...data,
          loading: false
        }));
      },
      error: (err) => {
        this.state.update(s => ({
          ...s,
          error: 'Connection error while loading operations data.',
          loading: false
        }));
      }
    });
  }

  attendTask(taskId: string) {
    this.tasksApi.updateTaskStatus(taskId, 'IN_PROGRESS').subscribe({
      next: (updatedTask) => {
        this.state.update(s => ({
          ...s,
          tasks: s.tasks.map(t => t.id === taskId ? updatedTask : t)
        }));
      }
    });
  }
}
