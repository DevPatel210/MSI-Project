import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UserManagementService } from 'src/app/services/user-management.service';

@Component({
  selector: 'app-bulk-upload-users',
  templateUrl: './bulk-upload-users.component.html',
  styleUrls: ['./bulk-upload-users.component.css'],
})
export class BulkUploadUsersComponent implements OnInit {
  isActive: boolean;
  success: boolean = false;
  error: boolean = false;
  errorList: any;
  uploading: boolean = false;
  uploadMessage: any = 'All rows inserted successfully.';
  constructor(
    private _fileService: FileUploadService,
    private _userService: UserManagementService
  ) {}
  ngOnInit(): void {}

  async uploadFile(file: any) {
    console.log(file);
    this.uploading = true;
    this.uploadMessage = 'Validating File Content and headers ...';
    try {
      const result = await this._fileService.validateFile(file, [
        'name',
        'email',
        'employeeid',
        'role',
        'password',
      ]);

      if (result === true) this.apiCall(result, file);
    } catch (err) {
      console.log(err);
      this.uploading = false;
      this.uploadMessage = err || 'Error';
      this.error = true;
      this.success = false;
    }
  }

  apiCall(result: any, file: any) {
    return new Promise((resolve, reject) => {
      if (result === true) {
        this.uploadMessage =
          'File Validated. Inserting data in the database ...';
        this._userService.addBulkUsers(file).subscribe(
          (res) => {
            console.log(res);
            this.success = true;
            this.error = false;
            if ('errorList' in res) {
              this.errorList = res.errorList;
            }
            this.uploadMessage = res.message;
            this.uploading = false;
            resolve('Successful');
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        );
      }
    });
  }

  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isActive = true;
    //console.log('Drag over');
  }

  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isActive = false;
    //console.log('Drag leave');
  }

  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.uploading == false) {
      this.isActive = false;
      let droppedFile = event.dataTransfer.files;
      if (droppedFile.length > 1) {
        console.log('Only single file allowed');
      } else {
        this.uploadFile(droppedFile[0]);
      }
    }
    this.isActive = false;
  }

  onSelectedFile(event: any) {
    this.uploadFile(event.target.files[0]);
  }
}
