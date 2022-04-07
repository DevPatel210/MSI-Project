import { SelectionModel } from '@angular/cdk/collections';
import { ViewChild, Component, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotifierService } from 'src/app/services/notifier.service';
import { UserManagementService } from 'src/app/services/user-management.service';
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
  ];
  dataSource = new MatTableDataSource<Users>();
  selection = new SelectionModel<Users>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _userService: UserManagementService,
    private _notifier: NotifierService
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

  displaySelected() {
    console.log(this.selection.selected);
  }
}
