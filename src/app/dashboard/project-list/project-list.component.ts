import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CsvDownloadService } from 'src/app/services/csv-download.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateDialog } from '../users/users.component';
import { ProjectManagementService } from 'src/app/services/project-management.service';
import { AuthService } from 'src/app/services/auth.service';

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
export class ProjectListComponent implements OnInit {
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
    private _notifier: NotifierService,
    private _csvService: CsvDownloadService,
    public dialog: MatDialog
  ) {
    this.role = this._authService.getRole();
  }

  ngOnInit(): void {
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
        this._notifier.showPopUp('Operation Succesful', res.message, 'success');
        this._projectService.getProjects().subscribe(
          (res) => {
            this.dataSource = new MatTableDataSource<Projects>(res.data);
            this.selection = new SelectionModel<Projects>(true, []);
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
      },
      (err) => {
        console.log(err);
        this._notifier.showPopUp('Error Occurred', err.error.message, 'error');
      }
    );
  }

  openDialog(user: {}) {
    const dialogRef = this.dialog.open(UpdateDialog, { data: user });

    dialogRef.afterClosed().subscribe(() => {
      this._projectService.getProjects().subscribe(
        (res) => {
          this.dataSource = new MatTableDataSource<Projects>(res.data);
          this.selection = new SelectionModel<Projects>(true, []);
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
