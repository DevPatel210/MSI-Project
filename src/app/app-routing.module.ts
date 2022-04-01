import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { ProjectListComponent } from './dashboard/project-list/project-list.component';
import { NewUserComponent } from './dashboard/new-user/new-user.component';
const routes:Routes = [
    {path:'login', component:LoginComponent},
    {path:'dashboard', component:DashboardComponent,canActivate:[AuthGuard],children:[
        {path:'projects',component:ProjectListComponent},
        {path:'addSingleUser',component:NewUserComponent},
        {path:'addBulkUsers',component:ProjectListComponent},
        {path:'addSingleProject',component:ProjectListComponent},
        {path:'addBulkProjects',component:ProjectListComponent},
        {path:'',redirectTo:'/dashboard/projects',pathMatch:'full'}
    ]},
    { path: '',   redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})


export class AppRoutingModule { }
export const Components = [LoginComponent,DashboardComponent]