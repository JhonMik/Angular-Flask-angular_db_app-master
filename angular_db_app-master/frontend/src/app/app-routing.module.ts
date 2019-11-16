import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommiteeComponent } from './components/pages/commitee/commitee.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoginComponent } from './admin/login/login.component';
import { LogoutComponent } from './admin/logout/logout.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { SecurityComponent } from './admin/security/security.component';
import { ItemsMangementComponent } from './admin/item-mangement/item-management.component';
import { UserManagementComponent } from './admin/user-management/user-mangement.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'security', component: SecurityComponent },
      { path: 'items', component: ItemsMangementComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
    ]
  },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard], },
  { path: 'login', component: LoginComponent },
  {
    path: 'home', component: HomeComponent,
    children: [
      { path: 'commitee', component: CommiteeComponent },
      { path: '', redirectTo: 'commitee', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '/home/commitee' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
