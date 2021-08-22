import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import {ReportComponent} from './report/report.component';


const routes: Routes = [
  { path: '', redirectTo: '/charts/resource', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'report', component: ReportComponent },
  { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsDemoModule) },
  { path: 'error-pages', loadChildren: () => import('./error-pages/error-pages.module').then(m => m.ErrorPagesModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
