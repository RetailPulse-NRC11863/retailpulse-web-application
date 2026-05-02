import {Component, computed, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink],
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
