import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectComponent } from './components/project/project.component';
import { TableComponent } from './components/table/table.component';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'projects/:id',
    component: ProjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tables/:id',
    component: TableComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
