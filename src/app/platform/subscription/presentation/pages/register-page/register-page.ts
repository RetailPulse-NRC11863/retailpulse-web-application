import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { switchMap } from 'rxjs/operators';

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

  step: number = 1;

  availablePlans = [
    {
      id: '1',
      name: 'Starter',
      price: 99,
      features: ['Dashboard Basico', 'Alertas de Personal', 'Gestion de Quiosco'],
    },
    {
      id: '2',
      name: 'Growth',
      price: 199,
      features: ['Todo lo de Starter', 'Reportes de Conversion', 'Soporte Prioritario'],
    },
    {
      id: '3',
      name: 'Premium',
      price: 299,
      features: ['Todo lo de Growth', 'Mapas de Calor (Heatmaps)', 'Analitica Predictiva'],
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
    this.nextStep();
  }

  finishRegister() {
    const newStore = { name: this.storeData.name, address: this.storeData.address };

    this.http.post<any>(`${environment.apiUrl}/stores`, newStore).pipe(
      switchMap(store => this.http.post(`${environment.apiUrl}/subscription/accounts`, {
        storeId: store.id,
        ownerEmail: this.userData.email,
        planId: Number(this.userData.planId || '3')
      }))
    ).subscribe({
      next: () => {
        localStorage.setItem('userRole', this.userData.role);
        localStorage.setItem('userName', this.userData.name);
        localStorage.setItem('userEmail', this.userData.email);
        localStorage.setItem('userPlan', this.userData.planId || '3');
        alert(`Suscripcion ${this.selectedPlan.name} activada con exito.`);
        this.router.navigate(['/app/admin/dashboard']);
      },
      error: () => alert('No se pudo crear la tienda en el backend.'),
    });
  }
}
