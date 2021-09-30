import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CyncCustomHttpService } from '@cyncCommon/services/cync-custom-http-service';
import { Helper } from '@cyncCommon/utils/helper';

@Component({
  selector: 'app-reset-user-status',
  templateUrl: './reset-user-status.component.html',
  styleUrls: ['./reset-user-status.component.scss']
})
export class ResetUserStatusComponent implements OnInit {
 

  constructor(public dialogRef: MatDialogRef<ResetUserStatusComponent>,private _message: MessageServices,private service: CyncCustomHttpService,private _helper: Helper, @Inject(MAT_DIALOG_DATA) public data) { console.log("resetdata",this.data);}

  ngOnInit() {
    
  }

  test(){
     this.dialogRef.close('Cancel');
  }
  
 //Utility Method  
 requestHeaders(): HttpHeaders {
  const httpHeader: HttpHeaders = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'access-control-allow-headers,access-control-allow-origin',
    'payloadBody': 'reset : true',  
  });
  return httpHeader;
}
  userResetStatusProcess():void{
  this.dialogRef.close('Proceed');
  // const httpOptions = { headers: this.requestHeaders() };
  //     let url = `admin/users/reset_terms?reset=true`;
  //     this.service.put(url,httpOptions).subscribe(data => {
  //       const message = data.message;
  //       this._helper.showApiMessages(message, 'success');
  //      this.dialogRef.close();
  //     }); 

  //   if(this.data.path==='save'){
  //     this.dialogRef.close('Proceed');
  //   }   
  }  
}
