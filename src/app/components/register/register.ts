import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

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
    // 1. Guardar usuario
    this.http.post('http://localhost:3000/users', this.userData).subscribe({
      next: () => {
        // 2. Guardar tienda vinculada al correo del administrador
        const newStore = { ...this.storeData, ownerEmail: this.userData.email };
        this.http.post('http://localhost:3000/stores', newStore).subscribe(() => {
          alert('¡Suscripción y tienda configuradas con éxito!');
          this.router.navigate(['/login']);
        });
      },
      error: () => alert('Asegúrate de que el JSON Server esté corriendo en el puerto 3000')
    });
  }
}
