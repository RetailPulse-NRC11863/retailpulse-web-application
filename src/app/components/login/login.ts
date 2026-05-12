import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule, // Permite el uso de routerLink en el HTML
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email = '';
  password = '';

  private http = inject(HttpClient);
  private router = inject(Router);

  handleLogin(event: Event) {
    event.preventDefault();

    const url = `http://localhost:3000/users?email=${this.email}&password=${this.password}`;

    this.http.get<any[]>(url).subscribe({
      next: (users) => {
        if (users.length > 0) {
          const user = users[0];

          // Almacenamiento local para persistencia y control de acceso
          localStorage.setItem('userRole', user.role);
          localStorage.setItem('userName', user.name);
          localStorage.setItem('userPlan', user.planId || 'starter');

          // Redirección según el rol configurado en el db.json
          if (user.role === 'ADMIN') {
            this.router.navigate(['/app/admin/dashboard']);
          } else if (user.role === 'STAFF') {
            this.router.navigate(['/app/staff/alerts']);
          }
        } else {
          alert('Credenciales incorrectas. Verifica tu correo y contraseña.');
        }
      },
      error: (err) => {
        console.error('Error al conectar con JSON Server', err);
        alert('Error: Asegúrate de que el JSON Server esté corriendo en el puerto 3000');
      },
    });
  }
}
