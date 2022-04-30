import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private papaParse: Papa) {}

  validateFile(file: File, header: Array<string>): any {
    return new Promise((resolve, reject) => {
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
              console.log('CSV File Format Error. Headers not matching');
              reject('CSV File Format Error. Headers not matching');
            } else {
              // check for correct headers
              let allTrue = true;
              for (let i = 0; i < fileHeader.length; i++) {
                if (!header.includes(fileHeader[i])) {
                  allTrue = false;
                  console.log('CSV File Format Error. Headers not matching');
                  reject('CSV File Format Error. Headers not matching');
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
                  console.log(
                    `CSV File Data Error. Empty/Null values at rows ${emptyRows}`
                  );
                  reject(
                    `CSV File Data Error. Empty/Null values at rows ${emptyRows}`
                  );
                } else {
                  // Data is validated now start uploading
                  console.log('Data is validated');
                  console.log(Date.now() - start);
                  resolve(true);
                }
              }
              reject('');
            }
          } else {
            // console.log('Error: ', result.errors);
            let errRows = result.errors
              .map((err) => {
                return err.row;
              })
              .join();
            console.log(errRows);
            reject(`CSV File Format Error. Error at rows ${errRows}`);
          }
        },
        error: (err) => {
          console.log(err);
          reject(`Can't Upload File. ${err}`);
        },
      });
    });
  }
}
