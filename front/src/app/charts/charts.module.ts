import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { ChartjsComponent } from './chartjs/chartjs.component';
import { PerformanceComponent } from './performance/performance.component';
import { ReportComponent } from './report/report.component';



const routes: Routes = [
  { path: 'resources', component: ChartjsComponent },
  { path: 'performances', component: PerformanceComponent },
  {path: 'report', component:ReportComponent},

]

@NgModule({
  declarations: [ChartjsComponent, PerformanceComponent, ReportComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ChartsModule
  ]
})
export class ChartsDemoModule { }
