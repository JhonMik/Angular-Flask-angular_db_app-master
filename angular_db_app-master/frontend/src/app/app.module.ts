import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommiteeComponent } from './components/pages/commitee/commitee.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { CommonMaterialModule } from './components/shared/common-material.module';
import { SsSearchToolComponent } from './components/pages/commitee/ss-search-tool/ss-search-tool.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AvatarShowComponent } from './components/pages/commitee/avatar-show/avatar-show.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuItemComponent } from './components/pages/commitee/menu-item/menu-item.component';
import { UserDatailDlgComponent } from './components/pages/commitee/user-datail-dlg/user-datail-dlg.component';
import { MatPaginatorIntl } from '@angular/material';
import { CustomMatPaginatorIntl } from './components/pages/commitee/custom-mat-paginator-int';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UserManagementComponent } from './admin/user-management/user-mangement.component';
import { ItemsMangementComponent } from './admin/item-mangement/item-management.component';
import { SecurityComponent } from './admin/security/security.component';
import { LoginComponent } from './admin/login/login.component';
import { LogoutComponent } from './admin/logout/logout.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { AuthInterceptor } from './helpers/auth.interceptor';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { UpdateuserComponent } from './admin/user-management/updateuser/updateuser.component';
import { LoadcsvComponent } from './admin/user-management/loadcsv/loadcsv.component';
import { OrganizationMangementComponent } from './admin/item-mangement/children/organization/org-management.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AppComponent,
    CommiteeComponent,
    NavbarComponent,
    SsSearchToolComponent,
    AvatarShowComponent,
    MenuItemComponent,
    UserDatailDlgComponent,
    DashboardComponent,
    UserManagementComponent,
    ItemsMangementComponent,
    SecurityComponent,
    LoginComponent,
    LogoutComponent,
    AdminComponent,
    HomeComponent,
    UpdateuserComponent,
    LoadcsvComponent,
    OrganizationMangementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonMaterialModule,
    HttpClientModule,
    NgbModule,
    NgSelectModule
  ],
  providers: [{
    provide: MatPaginatorIntl,
    useClass: CustomMatPaginatorIntl
  }, {
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
  }, {
    provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true
  }],
  bootstrap: [AppComponent],
  entryComponents: [UserDatailDlgComponent]
})
export class AppModule { }
