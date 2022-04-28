import { Component, OnInit, ViewChild } from '@angular/core';
import { CsvDownloadService } from 'src/app/services/csv-download.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

export class CSVRecord {
  public name: any;
  public email: any;
  public employeeid: any;
  public role: any;
  public password: any;
}

@Component({
  selector: 'app-bulk-upload-users',
  templateUrl: './bulk-upload-users.component.html',
  styleUrls: ['./bulk-upload-users.component.css'],
})
export class BulkUploadUsersComponent implements OnInit {
  constructor(private _fileService: FileUploadService) {}
  ngOnInit(): void {}

  uploadListener($event: any) {
    let file = $event.target.files[0];
    this._fileService.validateFile(
      file,
      ['name', 'email', 'employeeid', 'role', 'password'],
      'user'
    );
  }
}
