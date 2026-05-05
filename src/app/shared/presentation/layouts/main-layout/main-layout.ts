import {Component, computed, inject, signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private readonly router = inject(Router);

  readonly isAdminView = computed(() =>
    this.router.url.includes('/app/admin')
  );

  readonly isStaffView = computed(() =>
    this.router.url.includes('/app/staff')
  );
}
