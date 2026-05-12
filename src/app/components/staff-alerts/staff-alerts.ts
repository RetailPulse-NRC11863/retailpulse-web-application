import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-staff-alerts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './staff-alerts.html',
  styleUrls: ['./staff-alerts.css']
})
export class StaffAlertsComponent {
  // Alertas simuladas de tu Bounded Context
  alerts = [
    { id: 1, type: 'Stock', message: 'Falta stock de Teclados Mecánicos', location: 'Pasillo 3', resolved: false },
    { id: 2, type: 'Asistencia', message: 'Cliente solicitó ayuda en quiosco', location: 'Zona de Laptops', resolved: false },
    { id: 3, type: 'Tráfico', message: 'Aglomeración detectada', location: 'Caja 2', resolved: false }
  ];

  resolveAlert(id: number) {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) alert.resolved = true;
  }
}