import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-bulk-upload-projects',
  templateUrl: './bulk-upload-projects.component.html',
  styleUrls: ['./bulk-upload-projects.component.css'],
})
export class BulkUploadProjectsComponent implements OnInit {
  constructor(private _fileService: FileUploadService) {}
  ngOnInit(): void {}

  uploadListener($event: any) {
    let file = $event.target.files[0];
    this._fileService.validateFile(
      file,
      [
        'projectname',
        'deptcode',
        'users',
        'products',
        'status',
        'cieareaid',
        'financeproductid',
      ],
      'project'
    );
  }
}
