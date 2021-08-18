import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { ChartjsComponent } from './chartjs/chartjs.component';
import { PerformanceComponent } from './performance/performance.component';
import { ResourceComponent } from './resource/resource.component';

const routes: Routes = [
  { path: 'chartjs', component: ChartjsComponent },
  { path: 'resource', component: ResourceComponent },
  {path: 'performance', component: PerformanceComponent}
]

@NgModule({
  declarations: [ChartjsComponent, PerformanceComponent, ResourceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ChartsModule
  ]
})
export class ChartsDemoModule { }
