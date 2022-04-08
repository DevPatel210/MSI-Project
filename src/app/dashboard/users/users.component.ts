import { SelectionModel } from '@angular/cdk/collections';
import {
  ViewChild,
  Component,
  OnInit,
  AfterViewInit,
  Inject,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CsvDownloadService } from 'src/app/services/csv-download.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { UserManagementService } from 'src/app/services/user-management.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from 'src/app/shared/validation';
export interface Users {
  name: string;
  email: string;
  employeeid: number;
  role: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'name',
    'email',
    'employeeid',
    'role',
    'edit',
  ];
  dataSource = new MatTableDataSource<Users>();
  selection = new SelectionModel<Users>(true, []);
  displayStyle = 'none';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _userService: UserManagementService,
    private _notifier: NotifierService,
    private _csvService: CsvDownloadService,
    public dialog: MatDialog
  ) {}

  ngAfterViewInit() {}

  ngOnInit(): void {
    this._userService.getUsers().subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource<Users>(res.data);
        this.selection = new SelectionModel<Users>(true, []);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      (err) => {
        console.log(err.error);
        this._notifier.showPopUp('Error Occurred', err.error.message, 'error');
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
  checkboxLabel(row?: Users): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.employeeid
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

  displaySelected() {
    this._csvService.downloadFile(this.selection.selected, 'users');
  }

  openDialog(user: {}) {
    const dialogRef = this.dialog.open(UpdateDialog, { data: user });

    dialogRef.afterClosed().subscribe(() => {
      this._userService.getUsers().subscribe(
        (res) => {
          this.dataSource = new MatTableDataSource<Users>(res.data);
          this.selection = new SelectionModel<Users>(true, []);
          console.log('Successful');
        },
        (err) => {
          console.log(err.error);
          this._notifier.showPopUp(
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
  templateUrl: './update-dialog.component.html',
  styles: ['form button {margin-left:35%}'],
})
export class UpdateDialog {
  updateUserForm: FormGroup;
  Role: any = ['employee', 'admin', 'manager'];
  changeRole(e: any) {
    this.role?.setValue(e.target.value, { onlySelf: true });
  }

  get role() {
    return this.updateUserForm.get('role');
  }
  constructor(
    private fb: FormBuilder,
    private _userService: UserManagementService,
    private _notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateUserForm = this.fb.group({
      name: [data.name, Validators.required],
      email: [data.email, [Validators.required, Validators.email]],
      employeeID: [
        { value: data.employeeid, disabled: true },
        Validators.required,
      ],
      role: [data.role, Validators.required],
      // password: ['', [Validators.required, CustomValidator.passwordValidator]], // minlength is set in the html
    });
  }

  ngOnInit(): void {}
  public getError = (controlName: string, errorName: string) => {
    return this.updateUserForm.controls[controlName].hasError(errorName);
  };

  onSubmit() {
    const { name, email, role } = this.updateUserForm.value;
    this._userService
      .updateUser({ name, email, employeeID: this.data.employeeid, role })
      .subscribe(
        (res) => {
          console.log(res.message + '\n' + res.token);
          this._notifierService.showPopUp(
            'Operation Successful',
            res.message,
            'success'
          );
          this.updateUserForm.reset();
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
