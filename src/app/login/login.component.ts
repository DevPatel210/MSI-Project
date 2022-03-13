import { Component, OnInit } from '@angular/core';
import { FormGroup,Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CustomValidator } from '../shared/validation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm : FormGroup
  loginError:string=""
  constructor(private fb:FormBuilder, public router:Router,private _authService:AuthService) {
    this.loginForm = this.fb.group({
      email:["",[Validators.required,Validators.email]],
      password:["",[Validators.required,CustomValidator.passwordValidator]] // minlength is set in the html
    })
  }

  public getError = (controlName: string, errorName: string) =>{
    // console.log(this.loginForm.controls[controlName].hasError(errorName));
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  ngOnInit(): void {
  }

  onSubmit(){
    const {email,password} = this.loginForm.value;
    this._authService.loginUser({email,password}).subscribe(
      res => {
        // console.log(res.message+"\n"+res.token);
        this.loginError="";
        this._authService.setToken(res.token);
        this.router.navigate(["/dashboard"]);
      },
      err =>{ 
        console.log(err.error.message);
        this.loginError=err.error.message;
      }
    )
  }

}
