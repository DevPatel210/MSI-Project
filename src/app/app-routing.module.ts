import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { ProjectListComponent } from './dashboard/project-list/project-list.component';
import { NewUserComponent } from './dashboard/new-user/new-user.component';
import { UsersComponent } from './dashboard/users/users.component';
import { BulkUploadUsersComponent } from './dashboard/bulk-upload-users/bulk-upload-users.component';
import { NewProjectComponent } from './dashboard/new-project/new-project.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'projects',
        component: ProjectListComponent,
        data: { role: ['employee', 'admin', 'manager'] },
        canActivate: [AuthGuard],
      },
      {
        path: 'addSingleUser',
        component: NewUserComponent,
        data: { role: ['admin'] },
        canActivate: [AuthGuard],
      },
      {
        path: 'addBulkUsers',
        component: BulkUploadUsersComponent,
        data: { role: ['admin'] },
        canActivate: [AuthGuard],
      },
      {
        path: 'users',
        component: UsersComponent,
        data: { role: ['admin'] },
        canActivate: [AuthGuard],
      },
      {
        path: 'addSingleProject',
        component: NewProjectComponent,
        data: { role: ['admin', 'manager'] },
        canActivate: [AuthGuard],
      },
      {
        path: 'addBulkProjects',
        component: ProjectListComponent,
        data: { role: ['admin', 'manager'] },
        canActivate: [AuthGuard],
      },
      { path: '', redirectTo: '/dashboard/projects', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const Components = [LoginComponent, DashboardComponent];
