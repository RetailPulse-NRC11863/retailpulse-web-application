import { Injectable, signal, computed, inject } from '@angular/core';
import { Alert } from '../domain/model/alert.entity';
import { OperationalTask } from '../domain/model/operational-task.entity';
import { AlertsRecommendationsApiService } from '../infrastructure/services/alerts-recommendations-api.service';
import { forkJoin } from 'rxjs';

import { Recommendation } from '../domain/model/recommendation.entity';

export interface AlertsRecommendationsState {
  alerts: Alert[];
  operationalTasks: OperationalTask[];
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
  selectedPriority: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AlertsRecommendationsStore {
  private apiService = inject(AlertsRecommendationsApiService);

  private state = signal<AlertsRecommendationsState>({
    alerts: [],
    operationalTasks: [],
    recommendations: [],
    loading: false,
    error: null,
    selectedPriority: null
  });

  // State Signals
  alerts = computed(() => this.state().alerts);
  operationalTasks = computed(() => this.state().operationalTasks);
  recommendations = computed(() => this.state().recommendations);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  selectedPriority = computed(() => this.state().selectedPriority);

  // Computed Data
  activeAlerts = computed(() => 
    this.alerts().filter(alert => alert.status === 'PENDING' || alert.status === 'IN_PROGRESS')
  );
  
  pendingTasks = computed(() => 
    this.operationalTasks().filter(task => task.status === 'PENDING' || task.status === 'IN_PROGRESS')
  );
  
  highPriorityAlerts = computed(() => 
    this.activeAlerts().filter(alert => alert.priority === 'HIGH')
  );

  // Actions
  loadStaffOperations() {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    forkJoin({
      alerts: this.apiService.getActiveAlerts(),
      tasks: this.apiService.getOperationalTasks()
    }).subscribe({
      next: ({ alerts, tasks }) => {
        this.state.update(s => ({
          ...s,
          alerts,
          operationalTasks: tasks,
          loading: false
        }));
      },
      error: (err) => {
        this.state.update(s => ({
          ...s,
          error: 'Error loading staff operations. Please try again.',
          loading: false
        }));
        console.error('Failed to load staff operations', err);
      }
    });
  }

  loadAlerts() {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    
    this.apiService.getActiveAlerts().subscribe({
      next: (alerts) => {
        this.state.update(s => ({ ...s, alerts, loading: false }));
      },
      error: (err) => {
        this.state.update(s => ({
          ...s,
          error: 'Error loading alerts.',
          loading: false
        }));
        console.error('Failed to load alerts', err);
      }
    });
  }

  loadOperationalTasks() {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    
    this.apiService.getOperationalTasks().subscribe({
      next: (tasks) => {
        this.state.update(s => ({ ...s, operationalTasks: tasks, loading: false }));
      },
      error: (err) => {
        this.state.update(s => ({
          ...s,
          error: 'Error loading operational tasks.',
          loading: false
        }));
        console.error('Failed to load operational tasks', err);
      }
    });
  }

  loadRecommendations() {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    
    this.apiService.getRecommendations().subscribe({
      next: (recommendations) => {
        this.state.update(s => ({ ...s, recommendations, loading: false }));
      },
      error: (err) => {
        this.state.update(s => ({
          ...s,
          error: 'Error loading recommendations.',
          loading: false
        }));
        console.error('Failed to load recommendations', err);
      }
    });
  }

  markTaskAsAttended(taskId: string) {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    this.apiService.updateTaskStatus(taskId, 'RESOLVED').subscribe({
      next: (updatedTask) => {
        this.state.update(s => {
          const updatedTasks = s.operationalTasks.map(task => 
            task.id === taskId ? updatedTask : task
          );
          return { ...s, operationalTasks: updatedTasks, loading: false };
        });
      },
      error: (err) => {
        this.state.update(s => ({
          ...s,
          error: 'Error marking task as attended.',
          loading: false
        }));
        console.error('Failed to mark task as attended', err);
      }
    });
  }

  clearError() {
    this.state.update(s => ({ ...s, error: null }));
  }
}
