import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ProjectManagementService } from 'src/app/services/project-management.service';

@Component({
  selector: 'app-bulk-upload-projects',
  templateUrl: './bulk-upload-projects.component.html',
  styleUrls: ['./bulk-upload-projects.component.css'],
})
export class BulkUploadProjectsComponent implements OnInit {
  isActive: boolean;
  success: boolean = false;
  error: boolean = false;
  errorList: any;
  uploading: boolean = false;
  uploadMessage: any = 'All rows inserted successfully.';
  constructor(
    private _fileService: FileUploadService,
    private _projectService: ProjectManagementService
  ) {}
  ngOnInit(): void {}

  async uploadFile(file: any) {
    console.log(file);
    this.uploading = true;
    this.uploadMessage = 'Validating File Content and headers ...';
    try {
      const result = await this._fileService.validateFile(file, [
        'projectname',
        'deptcode',
        'users',
        'products',
        'status',
        'cieareaid',
        'financeproductid',
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
        this._projectService.addBulkProjects(file).subscribe(
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

  // onDroppedFile(droppedFiles: any) {
  //   let formData = new FormData();
  //   for (let item of droppedFiles) {
  //     formData.append('userfiles', item);
  //   }

  //   this.fileUploadService.fileUpload(formData).subscribe((result) => {
  //     this.upload = result;
  //   });
  // }

  onSelectedFile(event: any) {
    this.uploadFile(event.target.files[0]);
  }
}
