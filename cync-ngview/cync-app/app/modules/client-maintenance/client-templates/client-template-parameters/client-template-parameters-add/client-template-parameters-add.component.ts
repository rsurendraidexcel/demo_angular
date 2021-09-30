import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientTemplatesService } from "../../service/client-templates.service";
import { Helper } from '@cyncCommon/utils/helper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-template-parameters-add',
  templateUrl: './client-template-parameters-add.component.html',
  styleUrls: ['./client-template-parameters-add.component.scss']
})
export class ClientTemplateParametersAddComponent implements OnInit {

  creatClientTemplateForm: FormGroup;
  flag1: string;
  flag2: string;
  flag3: string;
  btnStyle1: string;
  btnStyle2: string;
  btnStyle3: string;
  addNewClientTemplateData: any;
  post_url: any;
  partialData: any;
  newTemplateId: any;
  newTemplateData: any;
  view_permission:any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private clientTemplateDetails: ClientTemplatesService,
    private helper_messege: Helper,
    private _message: MessageServices
  ) { }

  ngOnInit() {
    this.view_permission = localStorage.getItem('client_template_view_permission');
    this.flag1 = "active";
    this.flag2 = "inactive";
    this.flag3 = "inactive";
    this.btnStyle1 = "linkBtnActive";
    /****Create Template Form */
    this.creatClientTemplateForm = this.formBuilder.group({
      templateName: [''],
      templateDescription: [''],
      isActive: '',
      isDefault: ''
    });

  }

  /************navigation between tabs*******/
  navigatePannel(x) {

    if (x == 1) {
      this.flag1 = "active";
      this.flag2 = "inactive";
      this.flag3 = "inactive";

      this.btnStyle1 = "linkBtnActive";
      this.btnStyle2 = "linkBtninActive";
      this.btnStyle3 = "linkBtninActive";

    }
    else if (x == 2) {
      this.flag1 = "inactive";
      this.flag2 = "active";
      this.flag3 = "inactive";

      this.btnStyle1 = "linkBtninActive";
      this.btnStyle2 = "linkBtnActive";
      this.btnStyle3 = "linkBtninActive";

    }
    else if (x == 3) {

      this.flag1 = "inactive";
      this.flag2 = "inactive";
      this.flag3 = "active";

      this.btnStyle1 = "linkBtninActive";
      this.btnStyle2 = "linkBtninActive";
      this.btnStyle3 = "linkBtnActive";
    }
  }

  /******* Form submit action  ********/
  oncreatClientTemplateSubmit(response: any) {
    // response body creation for post
    let postBody = {
      "client_template": {
        "name": response.templateName,
        "status": response.isActive,
        "default": response.isDefault,
        "description": response.templateDescription
      }
    }

    this.addNewClientTemplateData = postBody;
    this.post_url = "client_templates";
    this.clientTemplateDetails.addNewTemplate(this.post_url, this.addNewClientTemplateData)
      .subscribe(success => {
          const tempresponse =  <any>JSON.parse(success._body);
        
        this.helper_messege.showApiMessages("New Template has been created", 'success')
        this.navigatetoNewTemplate(tempresponse.id)

      }, error => {
        this.helper_messege.showApiMessages(error.message, 'error')
      }

      );

  }

  // after creating a template navigate to view mode
  navigatetoNewTemplate(id: any) {
    if(this.view_permission === 'true'){
      this.router.navigate(['/client-maintenance/client-templates/client-parameters/', id]);
      this._message.showLoader(false);
    }else{
      this.router.navigate(['/client-maintenance/client-templates/']);
      this._message.showLoader(false);
    }
  }

  //cancel operation 

  cancelOperationFn(){
    const popupParam = { 'title': 'Confirmation', message: "Do you want to cancel this operation ?", 'msgType': 'warning' };
    this.helper_messege.openConfirmPopup(popupParam).subscribe(result => {
      if (result) {
        this.router.navigate(['/client-maintenance/client-templates/']);
      } else {

        return false
      }
    })
  }

    // default button pop up functionality

    defaultPOPupFn() {
      var defaultValue = this.creatClientTemplateForm.controls['isDefault'].value;
      var activeValue = this.creatClientTemplateForm.controls['isActive'].value;
      // if make default template radio button true
      // if (defaultValue == true && activeValue == false) {
      //   $('#templateDefaultID').prop('checked', false);
      //  // const popupParam = { 'title': 'Confirmation', message: "Inactive template cannot be active", 'msgType': 'warning' };
      //   this.helper_messege.openAlertPoup('Inactive Template','Inactive template cannot be default' )  //.subscribe(result => {
      //   //   if (result) {
      //   //     $('#templateDefaultID').prop('checked', false);
      //   //   } else {
  
      //   //     $('#templateDefaultID').prop('checked', false);
      //   //   }
      //   // });
      // }

      if (defaultValue == true && activeValue == true) {
        const popupParam = { 'title': 'Confirmation', message: "Do you want to make this template default ?", 'msgType': 'warning' };
        this.helper_messege.openConfirmPopup(popupParam).subscribe(result => {
          if (result) {
            return true
          } else {
  
            $('#templateDefaultID').prop('checked', false);
            this.creatClientTemplateForm.controls['isDefault'].setValue(false);
          }
        });
      }

      if (defaultValue == true && activeValue == false) {
        const popupParam = { 'title': 'Confirmation', message: "Do you want to make this template default ?", 'msgType': 'warning' };
        this.helper_messege.openConfirmPopup(popupParam).subscribe(result => {
          if (result) {
            return true
          } else {
  
            $('#templateDefaultID').prop('checked', false);
            this.creatClientTemplateForm.controls['isDefault'].setValue(false);
          }
        });
      }

    }

}