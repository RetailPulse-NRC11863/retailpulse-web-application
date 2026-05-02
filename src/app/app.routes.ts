import { Routes } from '@angular/router';

import {AccessPage} from './shared/presentation/pages/access-page/access-page';
import {MainLayout} from './shared/presentation/layouts/main-layout/main-layout';
import {PageNotFound} from './shared/presentation/pages/page-not-found/page-not-found';
import {DashboardPage} from './monitoring/presentation/pages/dashboard-page/dashboard-page';
import {
  StoreConfigurationPage
} from './store-configuration/presentation/pages/store-configuration-page/store-configuration-page';
import {SubscriptionPage} from './subscription/presentation/pages/subscription-page/subscription-page';
import {
  ConversionReportPage
} from './sales-conversion/presentation/pages/conversion-report-page/conversion-report-page';
import {AlertsPage} from './alerts-recommendations/presentation/pages/alerts-page/alerts-page';
import {KioskSearchPage} from './buyer-assistance/presentation/pages/kiosk-search-page/kiosk-search-page';

export const routes: Routes = [
  {
    path: '',
    component: AccessPage,
    title: 'RetailPulse - Access'
  },
  {
    path: 'app',
    component: MainLayout,
    children: [
      {
        path: '',
        redirectTo: 'admin/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'admin/dashboard',
        component: DashboardPage,
        title: 'RetailPulse - Admin Dashboard'
      },
      {
        path: 'admin/store-configuration',
        component: StoreConfigurationPage,
        title: 'RetailPulse - Store Configuration'
      },
      {
        path: 'admin/subscription',
        component: SubscriptionPage,
        title: 'RetailPulse - Subscription'
      },
      {
        path: 'admin/conversion',
        component: ConversionReportPage,
        title: 'RetailPulse - Conversion Reports'
      },
      {
        path: 'staff/alerts',
        component: AlertsPage,
        title: 'RetailPulse - Staff Alerts'
      }
    ]
  },
  {
    path: 'kiosk',
    component: KioskSearchPage,
    title: 'RetailPulse - Kiosk'
  },
  {
    path: '**',
    component: PageNotFound,
    title: 'RetailPulse - Page Not Found'
  }
];
