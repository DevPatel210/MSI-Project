import { Injectable } from '@angular/core';
import { MessagePopUpComponent } from '../dashboard/message-pop-up/message-pop-up.component';
import {MatSnackBar} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  constructor(private snackBar:MatSnackBar) { }

  showPopUp(status:string,displayMessage:string,type:'error'|'success'){
    this.snackBar.openFromComponent(MessagePopUpComponent,{
      data:{
        status:status,
        message:displayMessage,
      },
      duration:4000,
      horizontalPosition:'center',
      verticalPosition:'top',
      panelClass:type
    })
  }
}
