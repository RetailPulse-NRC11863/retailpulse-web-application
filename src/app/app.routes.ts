import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login';
import { MainLayout } from './shared/presentation/layouts/main-layout/main-layout';
import { PageNotFound } from './shared/presentation/pages/page-not-found/page-not-found';
import { DashboardPageComponent } from './traffic-analytics/presentation/pages/dashboard-page/dashboard-page';
import { StoreConfigurationPageComponent } from './platform/store-setup/presentation/pages/store-configuration-page/store-configuration-page';
import { SubscriptionPageComponent } from './platform/subscription/presentation/pages/subscription-page/subscription-page';
import { RegisterPageComponent } from './platform/subscription/presentation/pages/register-page/register-page';
import { ConversionReportPage } from './promotion-optimization/presentation/pages/conversion-report-page/conversion-report-page';
import { AlertsPage } from './store-operations/presentation/pages/alerts-page/alerts-page';
import { KioskSearchPageComponent } from './assisted-shopping/presentation/pages/kiosk-search-page/kiosk-search-page';
import { StoreHeatmapPageComponent } from './traffic-analytics/presentation/pages/store-heatmap-page/store-heatmap-page';
import { planCapabilityGuard } from './platform/subscription/presentation/guards/plan-capability.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'RetailPulse - Login',
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    title: 'RetailPulse - Register',
  },
  {
    path: 'app',
    component: MainLayout,
    children: [
      {
        path: '',
        redirectTo: 'admin/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'admin/dashboard',
        component: DashboardPageComponent,
        title: 'RetailPulse - Admin Dashboard',
      },
      {
        path: 'admin/store-configuration',
        component: StoreConfigurationPageComponent,
        title: 'RetailPulse - Store Configuration',
      },
      {
        path: 'admin/subscription',
        component: SubscriptionPageComponent,
        title: 'RetailPulse - Subscription',
      },
      {
        path: 'admin/store-heatmap',
        component: StoreHeatmapPageComponent,
        title: 'RetailPulse - Store Heatmap',
        canActivate: [planCapabilityGuard('heatmap')],
      },
      {
        path: 'admin/conversion',
        component: ConversionReportPage,
        title: 'RetailPulse - Conversion Reports',
        canActivate: [planCapabilityGuard('conversion')],
      },
      {
        path: 'staff/alerts',
        component: AlertsPage,
        title: 'RetailPulse - Staff Alerts',
      },
    ],
  },
  {
    path: 'kiosk',
    component: KioskSearchPageComponent,
    title: 'RetailPulse - Kiosk',
  },
  {
    path: '**',
    component: PageNotFound,
    title: 'RetailPulse - Page Not Found',
  },
];
