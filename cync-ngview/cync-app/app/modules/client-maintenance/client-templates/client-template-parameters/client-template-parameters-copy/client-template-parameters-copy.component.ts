import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Helper } from '@cyncCommon/utils/helper';
import { ClientTemplatesService } from '../../service/client-templates.service';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-client-template-parameters-copy',
  templateUrl: './client-template-parameters-copy.component.html',
  styleUrls: ['./client-template-parameters-copy.component.scss']
})
export class ClientTemplateParametersCopyComponent implements OnInit {

  mainTemplateform: FormGroup;
  creatClientTemplateForm: FormGroup;
  oldtemplateDefaultValue: any;
  flag1: string;
  flag2: string;
  flag3: string;
  btnStyle1: string;
  btnStyle2: string;
  btnStyle3: string;
  cloneClientTemplateData: any;
  post_url: any;
  templateViewId: any;
  partialViewData: any;
  clientTemplateViewData: any;
  partialData:any;
  newTemplateData:any;
  newTemplateId:any;
  navigatefromview:boolean = false;
  view_permission: any;


  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
    private clientTemplateDetails: ClientTemplatesService, private _message: MessageServices,
    private helper_messege: Helper,  private router: Router) {
    // geting active client template id for edit
    this.route.params.subscribe(params => this.templateViewId = params.id);
    this.route.queryParams.subscribe(params => { 
      this.oldtemplateDefaultValue = params['default']; 
      if(params['navigatefrom']){
        if(params['navigatefrom']=="view"){
          this.navigatefromview = true
        }
      }
  
    });

    this.mainTemplateform = this.formBuilder.group({

    });
  }


  ngOnInit() {
    this.view_permission = localStorage.getItem('client_template_view_permission');
    this.setTemplateViewType();

    this.flag1 = "active";
    this.flag2 = "inactive";
    this.flag3 = "inactive";
    this.btnStyle1 = "linkBtnActive";

    /****Create Template Form */
    this.creatClientTemplateForm = this.formBuilder.group({
      templateName: [''],
      isDefault: ''
    });

    this.getTemplateViewDetails();
    this.shareTemplateId()

  }

  formInitialized(name: string, form: FormGroup, viewType) {
    this.mainTemplateform.setControl(name, form);

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

  /****************** */

  /******* Form submit action for copy  ********/

  oncreatClientTemplateSubmit(response: any) {

    // response body creation for post
    let postBody = {
      "client_template": {
        "name": response.templateName,  
           
        "default": this.oldtemplateDefaultValue,
        
      }
    }


    this.cloneClientTemplateData = postBody;

    this.post_url = "client_templates/" + this.templateViewId + '/copy_client_template';

    this.clientTemplateDetails.cloneTemplate(this.post_url, this.cloneClientTemplateData)
      .subscribe(success => {
        const tempresponse =  <any>JSON.parse(success._body);
        this.helper_messege.showApiMessages("Template Cloned Successfully, Please edit for make changes", 'success')
        this.navigatetoNewTemplate(tempresponse.id)

      }, error => {
        this.helper_messege.showApiMessages(error.message, 'error')
       
      }

      );
  }

  // client template cancel operation

  cancelOperationFn() {
    const popupParam = { 'title': 'Confirmation', message: "Do you want to cancel this operation ?", 'msgType': 'warning' };
    this.helper_messege.openConfirmPopup(popupParam).subscribe(result => {
      if (result) {
        if(this.navigatefromview==false)
        {
          this.router.navigate(['/client-maintenance/client-templates/']);
        }
        else{
          this.router.navigate(['/client-maintenance/client-templates/client-parameters/' + this.templateViewId])
        }
        
      } else {

        return false
      }
    })
  }

  // Get data for bind in edit page

  getTemplateViewDetails() {
    this.clientTemplateViewData = this.clientTemplateDetails.gettemplateviewdetails('client_templates/' + this.templateViewId).subscribe(data => {
      this.partialViewData = <any>JSON.parse(data._body);

      this.clientTemplateViewData = this.partialViewData.data;
      this.patchValues(this.clientTemplateViewData)

      this.clientTemplateDetails.receiveTemplateData(this.clientTemplateViewData);

    })
  }

  // binding data to template Form
  patchValues(data) {

    this.creatClientTemplateForm.patchValue({
      templateName: '',
      templateDescription: data.description,
      isActive: data.status,
      
    })
  }
  /**********************************/

  // // default button pop up functionality

  defaultPOPupFn() {
    var originalDefaultValue = this.clientTemplateViewData.default;
    var defaultValue = this.creatClientTemplateForm.controls['isDefault'].value;

    // if make default template radio button true
    if (defaultValue == true && originalDefaultValue == false) {
      const popupParam = { 'title': 'Confirmation', message: "Do you want to change Default Client Template", 'msgType': 'warning' };
      this.helper_messege.openConfirmPopup(popupParam).subscribe(result => {
        if (result) {
          return true;
        } else {

          $('#templateDefaultID').prop('checked', false);
        }
      });
    }
    // if make existing default false
    if (defaultValue == false && originalDefaultValue == true) {
      const popupParam = { 'title': 'Confirmation', message: "It will change default value of the Template", 'msgType': 'warning' };
      this.helper_messege.openConfirmPopup(popupParam).subscribe(result => {
        if (result) {
          return true;
        } else {
          $('#templateDefaultID').prop('checked', true);

        }
      });
    }
  }

  //   // status button pop up functionality

  // statusPOPupFn(){
  //   var originalStatusValue = this.clientTemplateViewData.status;
  //   var StatusValue =  this.creatClientTemplateForm.controls['isActive'].value;

  //           // if make status template radio button false
  //           if(StatusValue == false && originalStatusValue == true){
  //             const popupParam = { 'title': 'Confirmation', message: "Do you want to make this Template inactive", 'msgType': 'warning' };
  //             this.helper_messege.openConfirmPopup(popupParam).subscribe(result => {
  //               if (result) {
  //                 return true;     
  //               } else {

  //                 $('#templateStatusID').prop('checked', true);
  //               }
  //             });
  //           }
  // }

  /************************/

  // sharing template id with child component

  shareTemplateId() {
    this.clientTemplateDetails.setTemplateIdForPost(this.templateViewId);
  }

    // share view type with childs
    setTemplateViewType(){
      let viewType = "copy";
      this.clientTemplateDetails.setTemplateViewType(viewType);
    }

    navigatetoNewTemplate(id: any) {
      if(this.view_permission === 'true'){
        this.router.navigate(['/client-maintenance/client-templates/client-parameters/', id ])
        this._message.showLoader(false);
      }else{
        this.router.navigate(['/client-maintenance/client-templates/']);
        this._message.showLoader(false);
      }
    }

}
