import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsRecommendationsStore } from '../../../application/alerts-recommendations-store.service';
import { AlertCardComponent } from '../../components/alert-card/alert-card';
import { TaskCardComponent } from '../../components/task-card/task-card';
import { LucideAngularModule, BellRing, ClipboardList, Activity } from 'lucide-angular';

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [CommonModule, AlertCardComponent, TaskCardComponent, LucideAngularModule],
  templateUrl: './alerts-page.html',
  styleUrls: ['./alerts-page.css']
})
export class AlertsPage implements OnInit {
  store = inject(AlertsRecommendationsStore);

  readonly BellRing = BellRing;
  readonly ClipboardList = ClipboardList;
  readonly Activity = Activity;

  ngOnInit() {
    this.store.loadStaffOperations();
  }

  onAttendTask(taskId: string) {
    this.store.markTaskAsAttended(taskId);
  }
}
