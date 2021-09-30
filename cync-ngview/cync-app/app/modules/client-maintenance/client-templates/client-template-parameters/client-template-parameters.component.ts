import { Component, OnInit, ViewChild, HostListener, Renderer2, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientTemplatesService } from "../service/client-templates.service";
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from '@cyncCommon/utils/helper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { MatDialog } from '@angular/material';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Component({
  selector: 'app-client-template-parameters',
  templateUrl: './client-template-parameters.component.html',
  styleUrls: ['./client-template-parameters.component.scss']
})
export class ClientTemplateParametersComponent implements OnInit, AfterViewInit {

  mainTemplateform: FormGroup;
  partialData: any;
  partialViewData: any;
  clientTemplateBasicData: any;
  templateArrayForDropdown: any;
  clientTemplateViewData: any;
  flag1: string;
  flag2: string;
  flag3: string;
  btnStyle1: string;
  btnStyle2: string;
  btnStyle3: string;
  creatClientTemplateForm: FormGroup
  templateViewId: any;
  selectedTemplatedropdown: string;
  defaultValueForClone: any;
  permissions: any;
  roleId: any;
  viewPermission: boolean;

  constructor(
    public dialog: MatDialog,
    private _helper: Helper,
    private _message: MessageServices,
    private fb: FormBuilder,
    private clientTemplateDetails: ClientTemplatesService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private apiMapper: APIMapper) {

    this.selectedTemplatedropdown = '';
    // geting active client template id
    this.route.params.subscribe(params => this.templateViewId = params.id);
    this.getTemplateDetails();

  }


  ngOnInit() {
    this.setRolesandPermissions();
    this.mainTemplateform = this.fb.group({
    });

    this.setTemplateViewType()
    // Calling view page details
    this.getTemplateViewDetails(this.templateViewId);
    //tab button initial stage
    this.flag1 = "active";
    this.flag2 = "inactive";
    this.flag3 = "inactive";
    this.btnStyle1 = "linkBtnActive";

    /**** View Template reactive Form */
    this.creatClientTemplateForm = this.formBuilder.group({
      templateName: '',
      templateDescription: '',
      isActive: '',
      isDefault: ''
    });
    this.creatClientTemplateForm.disable();
    this.shareTemplateId();

  }

  ngAfterViewInit() {
    const scrollElment = document.querySelector(".hscrollbar-tab");
    let h = $(self).height() - 370;
    scrollElment.addEventListener('scroll', ev => {
      h = $(self).height() - 370;
      this.renderer.setStyle(scrollElment, 'height', `${h}px`);
      this.renderer.setStyle(scrollElment, 'overflow-y', 'scroll');
    });
    this.renderer.setStyle(scrollElment, 'height', `${h}px`);
    this.renderer.setStyle(scrollElment, 'overflow-y', 'scroll');
  }

  //set roles and permissions
  setRolesandPermissions() {
    this.roleId = localStorage.getItem('cyncUserRoleId');
    let url = this.apiMapper.endpoints[CyncConstants.CLIENT_TEMPLATE_ROLES_AND_PERMISSION].replace('{role_id}', this.roleId);
    this.clientTemplateDetails.getRolesandPermissions(url).subscribe(response => {
      this.permissions = JSON.parse(response._body);
      if (this.checkPermissionForMenu('update')) {
        $("#Edit").css("display", "inline-block");
      } else {
        $("#Edit").css("display", "none");
      }
      if (this.checkPermissionForMenu('destroy')) {
        $("#templateViewDelete").css("display", "inline-block");
      } else {
        $("#templateViewDelete").css("display", "none");
      }
      if (this.checkPermissionForMenu('copy_client_template')) {
        $("#New").css("display", "inline-block");
      } else {
        $("#New").css("display", "none");
      }
      this.viewPermission = this.checkPermissionForMenu('show');
    });
  }

  //On Resize the window Change
  @HostListener('window:resize', ['$event'])
  onDocumentResize(event) {
    this.renderer.removeAttribute(document.querySelector("#app-body-container"), 'style');

  }

  // formInitialized(name: string, form: FormGroup) {
  //   this.mainTemplateform.setControl(name, form);
  //   // this.mainTemplateform.disable();
  // }

  //Get client template details //

  getTemplateDetails() {
    this.clientTemplateBasicData = this.clientTemplateDetails.gettemplatedetails('client_templates').subscribe(data => {
      this.partialData = <any>JSON.parse(data._body);
      this.clientTemplateBasicData = this.partialData.data;

      this.templateArrayForDropdown = Array.of(this.clientTemplateBasicData);

      this.templateArrayForDropdown = this.templateArrayForDropdown[0];

      this.templateArrayForDropdown = this.templateArrayForDropdown.map(elm => {
        return { 'value': elm.id, 'label': elm.name, 'dsc': elm.description };
      });


    })
  }

  //Get client template view page details //

  getTemplateViewDetails(id: any) {
    this.clientTemplateViewData = this.clientTemplateDetails.gettemplateviewdetails('client_templates/' + id).subscribe(data => {
      this.partialViewData = <any>JSON.parse(data._body);
      this.clientTemplateViewData = this.partialViewData.data;
      this.selectedTemplatedropdown = id;
      if (this.clientTemplateViewData.status == true) {
        $('#templateViewDelete').addClass('icon_disabled operation_disabled');
      }
      this.patchValues(this.clientTemplateViewData)
      // this.selectedTemplatedropdown = this.clientTemplateViewData.name
      this.defaultValueForClone = this.clientTemplateViewData.default
      // sharing all template data with child components

      this.clientTemplateDetails.receiveTemplateData(this.clientTemplateViewData);
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

  /**
   *  Navigation input x
   * @param x 
   */
  navigatePannel(x: any) {

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

  onChangeTemplateDropDown() {

    this.router.navigate(['/client-maintenance/client-templates/client-parameters/' + this.selectedTemplatedropdown])
    this.getTemplateViewDetails(this.selectedTemplatedropdown);

  }

  // Delete templete button performance
  onRemoveAction() {
    const popupParam = { 'title': 'Confirmation', message: "Do you want to delete this template ?", 'msgType': 'warning' };
    this._helper.openConfirmPopup(popupParam).subscribe(result => {
      if (result) {
        this._message.showLoader(true);
        this.clientTemplateDetails.deleteTemplate('client_templates?ids=' + this.templateViewId).subscribe(response => {    
          this._helper.showApiMessages("Successfully Deleted", 'success');
          this.router.navigate(['/client-maintenance/client-templates']);
          this._message.showLoader(false);
        });
      }
      else {
        return false
      }
    })
  }

  // Action when click on edit icon
  onEditAction() {
    const popupParam = { 'title': 'Confirmation', message: "Do you want to edit this template ?", 'msgType': 'warning' };
    this._helper.openConfirmPopup(popupParam).subscribe(result => {
      if (result) {
        this._message.showLoader(true);
        this.router.navigate(['/client-maintenance/client-templates/edit-client-parameters/' + this.templateViewId], { queryParams: { 'navigatefrom': 'view' } })
        this._message.showLoader(false);
      }
      else {
        return false
      }
    })
  }

  // template clone function
  cloneTemplate() {
    this.router.navigate(['/client-maintenance/client-templates/clone-client-parameters/' + this.templateViewId], { queryParams: { 'name': this.defaultValueForClone, 'navigatefrom': 'view' } })
    this.getTemplateViewDetails(this.templateViewId);
  }

  // sharing template id with child component

  shareTemplateId() {
    this.clientTemplateDetails.setTemplateIdForPost(this.templateViewId);
  }

  // share view type with childs
  setTemplateViewType() {
    let viewType = "view";
    this.clientTemplateDetails.setTemplateViewType(viewType);
  }
  /**
 * to get permissions for role
 * @param menuName
 * @param actionType
 */
  checkPermissionForMenu(actionType: string): boolean {
    if (this.permissions.length > 0) {
      for (let i = 0; i < this.permissions.length; i++) {
        if (this.permissions[i].action == actionType) {
          return this.permissions[i].enabled;
        }
      }
    }
  }
}
