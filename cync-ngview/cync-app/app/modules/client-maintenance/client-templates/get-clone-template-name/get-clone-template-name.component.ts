import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { ClientTemplatesService } from '../service/client-templates.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-get-clone-template-name',
  templateUrl: './get-clone-template-name.component.html',
  styleUrls: ['./get-clone-template-name.component.scss']
})
export class GetCloneTemplateNameComponent implements OnInit {
  cloneName:any;
  constructor(private clientTemplateDetails: ClientTemplatesService, private router: Router, private dialogRef: MatDialogRef<GetCloneTemplateNameComponent>, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(">>>>>>>>>>>>",this.data)
   }

   partialData:any
   clientTemplaterowData:any
  ngOnInit() {
   
    this.cloneName = this.fb.group({
      name: '',
      default: this.data.default
     
  });
  }
  getTemplateDetails() {
    this.clientTemplateDetails.gettemplatedetails('client_templates').subscribe(data => {
      this.partialData = <any>JSON.parse(data._body);
      this.clientTemplaterowData = this.partialData.data;
    });
  }

  submitTemplateName(form) {
    console.log(form)
    
}

close() {
    this.dialogRef.close();
}

}
