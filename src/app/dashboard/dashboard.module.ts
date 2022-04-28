import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ProjectListComponent,
  UpdateProject,
} from './project-list/project-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NewUserComponent } from './new-user/new-user.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MessagePopUpComponent } from './message-pop-up/message-pop-up.component';
import { AuthService } from '../services/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../services/token-interceptor.service';
import { UsersComponent } from './users/users.component';
import { UpdateDialog } from './users/users.component';
import { BulkUploadUsersComponent } from './bulk-upload-users/bulk-upload-users.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BulkUploadProjectsComponent } from './bulk-upload-projects/bulk-upload-projects.component';
@NgModule({
  declarations: [
    ProjectListComponent,
    NewUserComponent,
    MessagePopUpComponent,
    UsersComponent,
    UpdateDialog,
    BulkUploadUsersComponent,
    NewProjectComponent,
    UpdateProject,
    BulkUploadProjectsComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
})
export class DashboardModule {}
