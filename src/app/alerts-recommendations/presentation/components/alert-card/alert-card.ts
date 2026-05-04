import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alert } from '../../../domain/model/alert.entity';
import { LucideAngularModule, AlertCircle, AlertTriangle, Info, MapPin } from 'lucide-angular';

@Component({
  selector: 'app-alert-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './alert-card.html',
  styleUrls: ['./alert-card.css']
})
export class AlertCardComponent {
  @Input({ required: true }) alert!: Alert;
  
  readonly AlertCircle = AlertCircle;
  readonly AlertTriangle = AlertTriangle;
  readonly Info = Info;
  readonly MapPin = MapPin;
}
