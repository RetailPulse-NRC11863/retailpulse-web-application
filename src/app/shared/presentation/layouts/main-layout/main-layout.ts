import {Component, computed, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {LucideAngularModule, ChartColumnBig, Settings, ChartLine, CreditCard, Flame, Bell, RefreshCw} from 'lucide-angular';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgOptimizedImage, LucideAngularModule],
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
  protected readonly ChartColumnBig = ChartColumnBig;
  protected readonly Settings = Settings;
  protected readonly ChartLine = ChartLine;
  protected readonly CreditCard = CreditCard;
  protected readonly Flame = Flame;
  protected readonly Bell = Bell;
  protected readonly RefreshCw = RefreshCw;
}
