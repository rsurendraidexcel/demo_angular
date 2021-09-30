import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClientTemplatesService } from '../../service/client-templates.service';
import { Helper } from '@cyncCommon/utils/helper';
import { ActivatedRoute, Router } from '@angular/router';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { MessageServices } from '@cyncCommon/component/message/message.component';

@Component({
  selector: 'app-client-template-parameters-edit',
  templateUrl: './client-template-parameters-edit.component.html',
  styleUrls: ['./client-template-parameters-edit.component.scss']
})
export class ClientTemplateParametersEditComponent implements OnInit {


  mainTemplateform: FormGroup;
  creatClientTemplateForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private clientTemplateDetails: ClientTemplatesService,
    private _message: MessageServices,
    private renderer: Renderer2,
    private helper_messege: Helper,
    private router: Router
  ) {

    // geting active client template id for edit
    this.route.params.subscribe(params => this.templateViewId = params.id);
    this.route.queryParams.subscribe(params => {
      if (params['navigatefrom']) {
        if (params['navigatefrom'] == "view") {
          this.navigatefromview = true
        }
      }

    });

    this.mainTemplateform = this.formBuilder.group({

    });

    this.getTemplateViewDetails();

    this.clientTemplateDetails.gettemplateviewdetails('client_templates/' + this.templateViewId).subscribe(data => {
      var data = <any>JSON.parse(data._body);

      var datamain = data.data;
      this.isdefault = datamain.default
      
      if (this.isdefault === false || this.isdefault === null) {
       
        this.isRadioDisable = null;
      }
    })

  }
  flag1: string;
  flag2: string;
  flag3: string;
  btnStyle1: string;
  btnStyle2: string;
  btnStyle3: string;
  editClientTemplateData: any;
  post_url: any;
  templateViewId: any;
  basicparameterId: any
  partialViewData: any;
  clientTemplateViewData: any;
  tabchangeCondition: any = "proceed";
  navigatefromview: boolean = false;
  tabchangeval: any = "basic_parameter";
  isdefault: boolean;
  isRadioDisable: any = true;

  ngOnInit() {

    this.setTemplateViewType();
    this.flag1 = "active";
    this.flag2 = "inactive";
    this.flag3 = "inactive";
    this.btnStyle1 = "linkBtnActive";
    // setting basic parameter as initial tab


    /****Create Template Form */
    this.creatClientTemplateForm = this.formBuilder.group({
      templateName: [''],
      templateDescription: [''],
      isActive: '',
      isDefault: ''
    });
    this.shareTemplateId();

    this.clientTemplateDetails.getreturnTabChangeAnswer().subscribe(data => {
      this.tabchangeCondition = data;
    });



  }
  ngAfterViewInit() {
    const scrollElment = document.querySelector(".hscrollbar-tab");
    let h = $(self).height() - 350;
    scrollElment.addEventListener('scroll', ev => {
      h = $(self).height() - 350;
      this.renderer.setStyle(scrollElment, 'height', `${h}px`);
      this.renderer.setStyle(scrollElment, 'overflow-y', 'scroll');
    });
    this.renderer.setStyle(scrollElment, 'height', `${h}px`);
    this.renderer.setStyle(scrollElment, 'overflow-y', 'scroll');
  }

  //On Resize the window Change
  @HostListener('window:resize', ['$event'])
  onDocumentResize(event) {
    this.renderer.removeAttribute(document.querySelector("#app-body-container"), 'style');

  }

  // formInitialized(name: string, form: FormGroup, viewType) {
  //   this.mainTemplateform.setControl(name, form);

  // }

  /************navigation between tabs*******/

  navigatePannel(x) {

    this.clientTemplateDetails.setTabChangeValue(this.tabchangeval);
    // geting tab change condition answer from child components    

    if (x == 1 && this.tabchangeCondition == "proceed") {
      this.flag1 = "active";
      this.flag2 = "inactive";
      this.flag3 = "inactive";
      this.tabchangeval = "basic_parameter"
      this.btnStyle1 = "linkBtnActive";
      this.btnStyle2 = "linkBtninActive";
      this.btnStyle3 = "linkBtninActive";

    }
    else if (x == 2 && this.tabchangeCondition == "proceed") {
      this.flag1 = "inactive";
      this.flag2 = "active";
      this.flag3 = "inactive";

      this.btnStyle1 = "linkBtninActive";
      this.btnStyle2 = "linkBtnActive";
      this.btnStyle3 = "linkBtninActive";
      this.tabchangeval = "ineligible_calc";
    }
    else if (x == 3 && this.tabchangeCondition == "proceed") {

      this.flag1 = "inactive";
      this.flag2 = "inactive";
      this.flag3 = "active";
      this.tabchangeval = "bucket_aging";
      this.btnStyle1 = "linkBtninActive";
      this.btnStyle2 = "linkBtninActive";
      this.btnStyle3 = "linkBtnActive";
    }


  }



  /******* Form submit action for edit  ********/

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


    this.editClientTemplateData = postBody;

    this.post_url = "client_templates/" + this.templateViewId;

    this.clientTemplateDetails.editTemplate(this.post_url, this.editClientTemplateData)
      .subscribe(success => {
        this.helper_messege.showApiMessages("Successfully Edited", 'success')
        this.router.navigate(['/client-maintenance/client-templates/client-parameters/' + this.templateViewId])

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
        if (this.navigatefromview == false) {
          this.router.navigate(['/client-maintenance/client-templates/']);
        }
        else {
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
      this.isdefault = this.clientTemplateViewData.default

      this.basicparameterId = this.clientTemplateViewData.parameter.data.id
      this.patchValues(this.clientTemplateViewData)

      // sharing all template data with child components
      this.clientTemplateDetails.receiveTemplateData(this.clientTemplateViewData);

      // sharing basic parameter id
      this.clientTemplateDetails.setBasicParameterId(this.basicparameterId);

    })
  }

  // binding data to template Form
  patchValues(data) {

    this.creatClientTemplateForm.patchValue({
      templateName: data.name,
      templateDescription: data.description,
      isActive: data.status,
      isDefault: data.default
    })
  }

  // default button pop up functionality

  defaultPOPupFn() {
    var StatusValue = this.creatClientTemplateForm.controls['isActive'].value;

    var originalDefaultValue = this.clientTemplateViewData.default;
    var defaultValue = this.creatClientTemplateForm.controls['isDefault'].value;

    

    // if (defaultValue == true && StatusValue == false) {
    //   const popupParam = { 'title': 'Confirmation', message: "Inactive template cannot be active", 'msgType': 'warning' };
    //   this.helper_messege.openConfirmPopup(popupParam).subscribe(result => {
    //     if (result) {
    //       $('#templateDefaultID').prop('checked', false);
    //     } else {

    //       $('#templateDefaultID').prop('checked', false);
    //     }
    //   });
    // }

    // if make default template radio button true
    if (defaultValue == true && originalDefaultValue == false) {
      const popupParam = { 'title': 'Confirmation', message: "Do you want to change default client template ?", 'msgType': 'warning' };
      this.helper_messege.openConfirmPopup(popupParam).subscribe(result => {
        if (result) {
          return true;
        } else {
          
          $('#templateDefaultID').prop('checked', false);
          this.creatClientTemplateForm.controls['isDefault'].setValue(false);
        }
      });
    }
    // // if make existing default false
    // if (defaultValue == false && originalDefaultValue == true) {
    //   const popupParam = { 'title': 'Confirmation', message: "Do you want to change default value of the Template", 'msgType': 'warning' };
    //   this.helper_messege.openConfirmPopup(popupParam).subscribe(result => {
    //     if (result) {
    //       return true;
    //     } else {
    //       $('#templateDefaultID').prop('checked', true);

    //     }
    //   });
    // }

    if (defaultValue == true && originalDefaultValue == null) {
      const popupParam = { 'title': 'Confirmation', message: "Do you want to change default client template ?", 'msgType': 'warning' };
      this.helper_messege.openConfirmPopup(popupParam).subscribe(result => {
        if (result) {
          return true;
        } else {
          $('#templateDefaultID').prop('checked', false);
          this.creatClientTemplateForm.controls['isDefault'].setValue(false);
        }
      });
    }

  }

  // status button pop up functionality

  statusPOPupFn() {
    var originalStatusValue = this.clientTemplateViewData.status;
    var StatusValue = this.creatClientTemplateForm.controls['isActive'].value;

    // if make status template radio button false
    if (StatusValue == false && originalStatusValue == true) {
      const popupParam = { 'title': 'Confirmation', message: "Do you want to make this template inactive ?", 'msgType': 'warning' };
      this.helper_messege.openConfirmPopup(popupParam).subscribe(result => {
        if (result) {
          return true;
        } else {

          $('#templateStatusID').prop('checked', true);
        }
      });
    }
    if (StatusValue == false && originalStatusValue == false) {
      const popupParam = { 'title': 'Confirmation', message: "Do you want to make this template inactive ?", 'msgType': 'warning' };
      this.helper_messege.openConfirmPopup(popupParam).subscribe(result => {
        if (result) {
          return true;
        } else {

          $('#templateStatusID').prop('checked', true);
        }
      });
    }
  }

  // sharing template id with child component

  shareTemplateId() {
    this.clientTemplateDetails.setTemplateIdForPost(this.templateViewId);
  }

  // share view type with childs
  setTemplateViewType() {
    let viewType = "edit";
    this.clientTemplateDetails.setTemplateViewType(viewType);
  }

  // if default template disable deafault and active radio button

  ifDefaultFn() {
    
    this.creatClientTemplateForm.disable();

  }


}
