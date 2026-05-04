import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationalTask } from '../../../domain/model/operational-task.entity';
import { LucideAngularModule, CheckCircle2, Clock, MapPin, AlertCircle, AlertTriangle, Info } from 'lucide-angular';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './task-card.html',
  styleUrls: ['./task-card.css']
})
export class TaskCardComponent {
  @Input({ required: true }) task!: OperationalTask;
  @Output() attend = new EventEmitter<string>();
  
  readonly CheckCircle2 = CheckCircle2;
  readonly Clock = Clock;
  readonly MapPin = MapPin;
  readonly AlertCircle = AlertCircle;
  readonly AlertTriangle = AlertTriangle;
  readonly Info = Info;

  onAttend() {
    this.attend.emit(this.task.id);
  }
}
