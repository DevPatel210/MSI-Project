// import { E } from '@angular/cdk/keycodes';
import { Injectable, Injector } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { throwError } from 'rxjs';
import { NotifierService } from './notifier.service';
import { ProjectManagementService } from './project-management.service';
import { UserManagementService } from './user-management.service';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private papaParse: Papa, private injector: Injector) {}
  _notifierService = this.injector.get(NotifierService);
  _projectService = this.injector.get(ProjectManagementService);
  _userService = this.injector.get(UserManagementService);

  validateFile(file: File, header: Array<string>, to: 'project' | 'user'): any {
    const start = Date.now();
    const parsedFile = this.papaParse.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log(result.data);
        console.log(result.meta);
        if (result.errors.length == 0) {
          const fileHeader = result.meta.fields;
          // check for header length
          if (header.length != fileHeader.length) {
            this._notifierService.showPopUp(
              'CSV File Format Error',
              `Headers not matching`,
              'error'
            );
          } else {
            // check for correct headers
            let allTrue = true;
            for (let i = 0; i < fileHeader.length; i++) {
              if (!header.includes(fileHeader[i])) {
                allTrue = false;
                this._notifierService.showPopUp(
                  'CSV File Format Error',
                  `Headers not matching`,
                  'error'
                );
                break;
              }
            }
            if (allTrue) {
              // check for empty values
              const data = result.data;
              let emptyRows = [];
              for (let i = 0; i < data.length; i++) {
                let curr = Object.values(data[i]);
                if (curr.includes('')) {
                  emptyRows.push(i + 1);
                }
              }
              if (emptyRows.length != 0) {
                this._notifierService.showPopUp(
                  'CSV File Data Error',
                  `Empty/Null values at rows ${emptyRows}`,
                  'error'
                );
              } else {
                // Data is validated now start uploading
                console.log('Data is validated');
                console.log(Date.now() - start);
                if (to == 'project') {
                  this._projectService.addBulkProjects(file).subscribe(
                    (res) => {
                      console.log(res);
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
                } else {
                  this._userService.addBulkUsers(file).subscribe(
                    (res) => {
                      console.log(res);
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
                }
              }
            }
          }
        } else {
          // console.log('Error: ', result.errors);
          let errRows = result.errors
            .map((err) => {
              return err.row;
            })
            .join();
          console.log(errRows);
          this._notifierService.showPopUp(
            'CSV File Format Error',
            `Error at rows ${errRows}`,
            'error'
          );
        }
      },
      error: (err) => {
        console.log(err);
        this._notifierService.showPopUp("Can't Upload File", err, 'error');
      },
    });
  }
}
