import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreOperationsStore } from '../../../application/store-operations-store.service';
import { AlertCardComponent } from '../../components/alert-card/alert-card';
import { TaskCardComponent } from '../../components/task-card/task-card';
import { LucideAngularModule, BellRing, ClipboardList, Activity } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [CommonModule, AlertCardComponent, TaskCardComponent, LucideAngularModule, TranslateModule],
  templateUrl: './alerts-page.html',
  styleUrls: ['./alerts-page.css']
})
export class AlertsPage implements OnInit {
  store = inject(StoreOperationsStore);

  readonly BellRing = BellRing;
  readonly ClipboardList = ClipboardList;
  readonly Activity = Activity;

  ngOnInit() {
    this.store.loadOperationsData();
  }

  onAttendTask(taskId: string) {
    this.store.attendTask(taskId);
  }
}
