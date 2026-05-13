import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  storeConfig: any = null;
  adminName: string | null = '';

  ngOnInit() {
    this.adminName = localStorage.getItem('userName') || 'Administrador';

    // Simula traer los datos de la tienda registrada
    this.http.get<any[]>('http://localhost:3000/stores').subscribe(stores => {
      if (stores.length > 0) {
        // Tomamos la última tienda registrada (en un entorno real buscaríamos por el ownerEmail)
        this.storeConfig = stores[stores.length - 1];
      }
    });
  }
}