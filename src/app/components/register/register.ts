import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  step: number = 1;

  userData = { email: '', password: '', role: 'ADMIN', name: 'Administrador' };
  storeData = { name: '', ruc: '', category: '', address: '', hours: '' };

  nextStep() {
    this.step++;
  }

  finishRegister() {
    const newStore = { name: this.storeData.name, address: this.storeData.address };

    this.http.post<any>(`${environment.apiUrl}/stores`, newStore).pipe(
      switchMap(store => this.http.post(`${environment.apiUrl}/subscription/accounts`, {
        storeId: store.id,
        ownerEmail: this.userData.email,
        planId: 3
      }))
    ).subscribe({
      next: () => {
        localStorage.setItem('userRole', this.userData.role);
        localStorage.setItem('userName', this.userData.name);
        localStorage.setItem('userEmail', this.userData.email);
        localStorage.setItem('userPlan', '3');
        alert('Suscripcion y tienda configuradas con exito.');
        this.router.navigate(['/app/admin/dashboard']);
      },
      error: () => alert('No se pudo crear la tienda en el backend.')
    });
  }
}
