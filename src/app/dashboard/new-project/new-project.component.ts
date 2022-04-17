import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'src/app/services/notifier.service';
import { CustomValidator } from 'src/app/shared/validation';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProjectManagementService } from 'src/app/services/project-management.service';
@Component({
  selector: 'app-new-user',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css'],
})
export class NewProjectComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  addProjectForm: FormGroup;
  filteredUsers: Observable<string[]>;
  selectedUsers: string[] = [];
  usersList: string[] = [];
  userCtrl: any;
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private _projectService: ProjectManagementService,
    private _notifierService: NotifierService
  ) {
    this.addProjectForm = this.fb.group({
      projectname: ['', Validators.required],
      deptcode: ['', Validators.required],
      users: [''],
      product: ['', Validators.required],
      status: [false, Validators.required],
      cieareaid: [, Validators.required],
      financeproductid: [, Validators.required],
    });

    this.userCtrl = this.addProjectForm.get('users');

    this._projectService.getUsers().subscribe(
      (res) => {
        this.usersList = res.data.map((user: any) => {
          return user.name;
        });
        console.log(this.usersList);
        this.filteredUsers = this.userCtrl.valueChanges.pipe(
          startWith(null),
          map((user: string | null) =>
            user ? this._filter(user) : this.usersList.slice()
          )
        );
      },
      (err) => {
        this._notifierService.showPopUp(
          'Unable to get users. Please refresh',
          err.error.message,
          'error'
        );
      }
    );
  }

  ngOnInit(): void {
    this.filteredUsers = this.userCtrl.valueChanges.pipe(
      startWith(null),
      map((user: string | null) =>
        user ? this._filter(user) : this.usersList.slice()
      )
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.selectedUsers.push(value);
    }

    event.chipInput!.clear();
    this.userCtrl.setValue(null);
  }

  remove(user: string): void {
    const index = this.selectedUsers.indexOf(user);

    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedUsers.push(event.option.viewValue);
    this.userInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.usersList.filter((user: any) =>
      user.toLowerCase().includes(filterValue)
    );
  }

  public getError = (controlName: string, errorName: string) => {
    return this.addProjectForm.controls[controlName].hasError(errorName);
  };

  onSubmit() {
    const {
      projectname,
      deptcode,
      product,
      status,
      cieareaid,
      financeproductid,
    } = this.addProjectForm.value;
    const users = this.selectedUsers;
    // console.log(this.addProjectForm.value + '\n Users: ' + this.selectedUsers);
    this._projectService
      .addSingleProject({
        projectname,
        deptcode,
        users,
        product,
        status,
        cieareaid,
        financeproductid,
      })
      .subscribe(
        (res) => {
          console.log(res.message + '\n' + res.token);
          this._notifierService.showPopUp(
            'Operation Successful',
            res.message,
            'success'
          );
          this.addProjectForm.reset();
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
