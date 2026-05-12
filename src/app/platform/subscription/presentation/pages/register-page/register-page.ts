import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css'],
})
export class RegisterPageComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  step: number = 1; // Ahora serán 4 pasos

  // 1. Planes SaaS Definitivos
  availablePlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 99,
      features: ['Dashboard Básico', 'Alertas de Personal', 'Gestión de Quiosco'],
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 199,
      features: ['Todo lo de Starter', 'Reportes de Conversión', 'Soporte Prioritario'],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 299,
      features: ['Todo lo de Growth', 'Mapas de Calor (Heatmaps)', 'Analítica Predictiva'],
    },
  ];

  selectedPlan: any = null;

  userData = { email: '', password: '', role: 'ADMIN', name: 'Administrador', planId: '' };
  storeData = { name: '', ruc: '', category: '', address: '', hours: '' };

  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }

  selectPlan(plan: any) {
    this.selectedPlan = plan;
    this.userData.planId = plan.id;
    this.nextStep(); // Pasa directo al pago
  }

  finishRegister() {
    this.http.post('http://localhost:3000/users', this.userData).subscribe({
      next: () => {
        const newStore = { ...this.storeData, ownerEmail: this.userData.email };
        this.http.post('http://localhost:3000/stores', newStore).subscribe(() => {
          alert(`¡Suscripción ${this.selectedPlan.name} activada con éxito!`);
          this.router.navigate(['/login']);
        });
      },
      error: () => alert('Error: Asegúrate de que el JSON Server esté corriendo en el puerto 3000'),
    });
  }
}
