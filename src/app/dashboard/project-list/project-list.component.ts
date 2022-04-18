import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild, Inject, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CsvDownloadService } from 'src/app/services/csv-download.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectManagementService } from 'src/app/services/project-management.service';
import { AuthService } from 'src/app/services/auth.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';

export interface Projects {
  id: number;
  projectName: string;
  deptCode: string;
  users: [];
  products: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  cieAreaId: boolean;
  financeProductId: boolean;
}

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent {
  displayedColumns: string[] = [
    'select',
    'id',
    'projectname',
    'deptcode',
    'users',
    'products',
    'status',
    'createdat',
    'updatedat',
    'cieareaid',
    'financeproductid',
    'edit',
  ];
  dataSource = new MatTableDataSource<Projects>();
  selection = new SelectionModel<Projects>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  role: string | null;
  constructor(
    private _authService: AuthService,
    private _projectService: ProjectManagementService,
    private _notifierService: NotifierService,
    private _csvService: CsvDownloadService,
    public dialog: MatDialog
  ) {
    this.role = this._authService.getRole();

    this._projectService.getProjects().subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource<Projects>(
          res.data.map((project: any) => {
            const createdat = project.createdat.substr(0, 10);
            const updatedat = project.updatedat.substr(0, 10);

            return { ...project, createdat, updatedat };
          })
        );
        this.selection = new SelectionModel<Projects>(true, []);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      (err) => {
        console.log(err.error);
        this._notifierService.showPopUp(
          'Error Occurred',
          err.error.message,
          'error'
        );
      }
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Projects): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id
    }`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editUser(data: {}) {
    console.log(data);
  }

  downloadSelected() {
    this._csvService.downloadFile(this.selection.selected, 'projects');
  }

  deleteSelected() {
    const projects = this.selection.selected.map((projectData) => {
      return projectData.id;
    });

    this._projectService.deleteProjects(projects).subscribe(
      (res) => {
        this._notifierService.showPopUp(
          'Operation Succesful',
          res.message,
          'success'
        );
        this._projectService.getProjects().subscribe(
          (res) => {
            this.dataSource = new MatTableDataSource<Projects>(
              res.data.map((project: any) => {
                const createdat = project.createdat.substr(0, 10);
                const updatedat = project.updatedat.substr(0, 10);

                return { ...project, createdat, updatedat };
              })
            );
            this.selection = new SelectionModel<Projects>(true, []);
          },
          (err) => {
            console.log(err.error);
            this._notifierService.showPopUp(
              'Error Occurred',
              err.error.message,
              'error'
            );
          }
        );
      },
      (err) => {
        console.log(err);
        this._notifierService.showPopUp(
          'Error Occurred',
          err.error.message,
          'error'
        );
      }
    );
  }

  openDialog(user: {}) {
    const dialogRef = this.dialog.open(UpdateProject, { data: user });

    dialogRef.afterClosed().subscribe(() => {
      this._projectService.getProjects().subscribe(
        (res) => {
          this.dataSource = new MatTableDataSource<Projects>(
            res.data.map((project: any) => {
              const createdat = project.createdat.substr(0, 10);
              const updatedat = project.updatedat.substr(0, 10);

              return { ...project, createdat, updatedat };
            })
          );
          this.selection = new SelectionModel<Projects>(true, []);
          console.log('Successful');
        },
        (err) => {
          console.log(err.error);
          this._notifierService.showPopUp(
            'Error Occurred',
            err.error.message,
            'error'
          );
        }
      );
    });
  }
}
@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-project.component.html',
  styles: [
    '.submit {margin-top: 22px;margin-left: 40%;margin-right: auto;background-color: #ffd048;width: 25%;min-width: 85px;}',
  ],
})
export class UpdateProject {
  updateProjectForm: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredUsers: Observable<string[]>;
  selectedUsers: string[] = [];
  usersList: string[] = [];
  userCtrl: any;
  userID: any;
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  constructor(
    private fb: FormBuilder,
    private _projectService: ProjectManagementService,
    private _notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this._projectService.getUsers().subscribe(
      (res) => {
        this.usersList = res.data.map((user: any) => {
          return user.name;
        });
        console.log(this.usersList);
        this.filteredUsers = this.userCtrl.valueChanges.pipe(
          startWith(null),
          map((user: string | null) =>
            user ? this._filter(user) : this.usersList.slice()
          )
        );
      },
      (err) => {
        this._notifierService.showPopUp(
          'Unable to get users. Please refresh',
          err.error.message,
          'error'
        );
      }
    );
    this.updateProjectForm = this.fb.group({
      projectname: [data.projectname, Validators.required],
      deptcode: [data.deptcode, Validators.required],
      users: [''],
      product: [data.products, Validators.required],
      status: [data.status, Validators.required],
      cieareaid: [data.cieareaid, Validators.required],
      financeproductid: [data.financeproductid, Validators.required],
    });
    this.userID = data.id;
    this.selectedUsers = data.users;
    this.userCtrl = this.updateProjectForm.get('users');
  }

  ngOnInit(): void {}

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.selectedUsers.push(value);
    }

    event.chipInput!.clear();
    this.userCtrl.setValue(null);
  }

  remove(user: string): void {
    const index = this.selectedUsers.indexOf(user);

    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedUsers.push(event.option.viewValue);
    this.userInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.usersList.filter((user: any) =>
      user.toLowerCase().includes(filterValue)
    );
  }

  public getError = (controlName: string, errorName: string) => {
    return this.updateProjectForm.controls[controlName].hasError(errorName);
  };

  onSubmit() {
    const id = this.userID;
    const {
      projectname,
      deptcode,
      product,
      status,
      cieareaid,
      financeproductid,
    } = this.updateProjectForm.value;
    const users = this.selectedUsers;
    console.log(this.updateProjectForm.value);
    console.log(this.selectedUsers);
    this._projectService
      .updateProject({
        id,
        projectname,
        deptcode,
        users,
        product,
        status,
        cieareaid,
        financeproductid,
      })
      .subscribe(
        (res) => {
          console.log(res.message + '\n' + res.token);
          this._notifierService.showPopUp(
            'Operation Successful',
            res.message,
            'success'
          );
          this.updateProjectForm.reset();
        },
        (err) => {
          console.log(err.error.message);
          this._notifierService.showPopUp(
            'Error Occurred',
            err.error.message,
            'error'
          );
        }
      );
  }
}
