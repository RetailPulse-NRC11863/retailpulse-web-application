import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { OperationalAlert } from '../domain/model/operational-alert.entity';
import { OperationalTask } from '../domain/model/operational-task.entity';
import { StoreOperationsApiService } from '../infrastructure/services/store-operations-api.service';
import { OperationalTasksApiService } from '../infrastructure/services/operational-tasks-api.service';
import { environment } from '../../../environments/environment';

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
  private http = inject(HttpClient);

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
      tasks: this.api.getTasks(),
      products: this.http.get<any[]>(`${environment.apiUrl}/products`),
      zones: this.http.get<any[]>(`${environment.apiUrl}/zones`)
    }).subscribe({
      next: (data) => {
        const products = data.products;
        const zones = data.zones;
        this.state.update(s => ({
          ...s,
          alerts: data.alerts.map(alert => this.enrichAlert(alert, products, zones)),
          tasks: data.tasks.map(task => this.enrichTask(task, products, zones)),
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
    this.tasksApi.completeTask(taskId).subscribe({
      next: (updatedTask) => {
        this.state.update(s => ({
          ...s,
          tasks: s.tasks.map(t => t.id === taskId ? this.copyTaskContext(updatedTask, t) : t)
        }));
      }
    });
  }

  private enrichAlert(alert: OperationalAlert, products: any[], zones: any[]): OperationalAlert {
    const product = products.find(p => String(p.id) === String(alert.productId));
    const zone = zones.find(z => String(z.id) === String(alert.zoneId || product?.zoneId));
    return new OperationalAlert({
      ...alert,
      productName: product?.name || alert.productName,
      zoneId: String(zone?.id ?? alert.zoneId ?? ''),
      zoneName: zone?.name || alert.zoneName
    });
  }

  private enrichTask(task: OperationalTask, products: any[], zones: any[]): OperationalTask {
    const product = products.find(p => String(p.id) === String(task.productId));
    const zone = zones.find(z => String(z.id) === String(task.zoneId || product?.zoneId));
    return new OperationalTask({
      ...task,
      productName: product?.name || task.productName,
      zoneId: String(zone?.id ?? task.zoneId ?? ''),
      zoneName: zone?.name || task.zoneName
    });
  }

  private copyTaskContext(updatedTask: OperationalTask, previousTask: OperationalTask): OperationalTask {
    return new OperationalTask({
      ...updatedTask,
      productName: previousTask.productName,
      zoneName: previousTask.zoneName
    });
  }
}
