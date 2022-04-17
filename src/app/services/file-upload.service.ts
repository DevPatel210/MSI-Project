import { Injectable } from '@angular/core';
// import CSVFileValidator from 'csv-file-validator';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor() {}

  userConfig = {
    headers: [
      {
        name: 'Name',
        inputName: 'name',
        required: true,
        requiredError: function (
          headerName: any,
          rowNumber: any,
          columnNumber: any
        ) {
          return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
        },
      },
      {
        name: 'Email',
        inputName: 'email',
        required: true,
        requiredError: function (
          headerName: any,
          rowNumber: any,
          columnNumber: any
        ) {
          return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
        },
        unique: true,
        uniqueError: function (headerName: any) {
          return `${headerName} is not unique`;
        },
        validate: function (email: any) {
          return true;
        },
        validateError: function (
          headerName: any,
          rowNumber: any,
          columnNumber: any
        ) {
          return `${headerName} is not valid in the ${rowNumber} row / ${columnNumber} column`;
        },
      },
      {
        name: 'Employee ID',
        inputName: 'employeeID',
        required: true,
        requiredError: function (
          headerName: any,
          rowNumber: any,
          columnNumber: any
        ) {
          return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
        },
        unique: true,
        uniqueError: function (headerName: any) {
          return `${headerName} is not unique`;
        },
      },
    ],
  };

  isEmailValid(email: any) {
    return true;
  }

  validateUserFile(file: File, config: any) {
    // CSVFileValidator(file, config)
    //   .then((csvData: any) => {
    //     console.log(csvData.data); // Array of objects from file
    //     console.log(csvData.inValidMessages); // Array of error messages
    //   })
    //   .catch((err: any) => {
    //     console.log(err);
    //   });
  }
}
