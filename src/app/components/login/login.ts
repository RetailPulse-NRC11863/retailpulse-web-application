import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email = '';
  password = '';

  private router = inject(Router);

  private readonly demoUsers = [
    {
      email: 'admin@retailpulse.com',
      password: 'admin',
      role: 'ADMIN',
      name: 'Jesus Andres',
      planId: '3'
    },
    {
      email: 'staff@retailpulse.com',
      password: 'staff',
      role: 'STAFF',
      name: 'Personal de Tienda',
      planId: '1'
    }
  ];

  handleLogin(event: Event) {
    event.preventDefault();

    const user = this.demoUsers.find(u => u.email === this.email && u.password === this.password);

    if (!user) {
      alert('Credenciales incorrectas. Verifica tu correo y contrasena.');
      return;
    }

    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userPlan', user.planId);

    if (user.role === 'ADMIN') {
      this.router.navigate(['/app/admin/dashboard']);
    } else if (user.role === 'STAFF') {
      this.router.navigate(['/app/staff/alerts']);
    }
  }
}
