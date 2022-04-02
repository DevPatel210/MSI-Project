import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'src/app/services/notifier.service';
import { UserManagementService } from 'src/app/services/user-management.service';
import { CustomValidator } from 'src/app/shared/validation';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  addUserForm : FormGroup
  Role:any = ["Employee","Admin","Manager"]
  changeRole(e:any){
    this.role?.setValue(e.target.value,{onlySelf:true})
  }
  
  get role(){
    return this.addUserForm.get('role');
  }

  
  constructor(private fb:FormBuilder,private _userService:UserManagementService, private _notifierService:NotifierService) {
    this.addUserForm = this.fb.group({
      name:["",Validators.required],
      email:["",[Validators.required,Validators.email]],
      employeeID:["",Validators.required],
      role:["",Validators.required],
      password:["",[Validators.required,CustomValidator.passwordValidator]] // minlength is set in the html
    })
  }

  ngOnInit(): void {
  }
  public getError = (controlName: string, errorName: string) =>{
    return this.addUserForm.controls[controlName].hasError(errorName);
  }

  onSubmit(){
    const {name,email,employeeID,role,password} = this.addUserForm.value;
    console.log(JSON.stringify(this.addUserForm.value));
    this._notifierService.showPopUp("Operation Successful","","success")
    // this._userService.addSingleUser({name,email,employeeID,role,password}).subscribe(
    //   res => {
    //     console.log(res.message+"\n"+res.token);
    //     this._notifierService.showPopUp("Operation Successful",res.message,"success");
    //   },
    //   err =>{ 
    //     console.log(err.error.message);
    //     this._notifierService.showPopUp("Error Occurred",err.error.message,"error")
    //   }
    // )
  }

}
