import { Component, OnInit } from '@angular/core';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { GridModel, ColumnDefinition } from '../../../../app-common/component/grid/grid.model';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';
import { AppConfig } from '../../../app.config';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from "@angular/router";
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { ActivatedRoute } from '@angular/router';
import { FormvalidationService } from '../../../../app-common/formValidation/formvalidation.service';
import { Location } from '@angular/common';
import { CheckPermissionsService } from '../../../../app-common/component/roles-and-permissions/check-permissions.service';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  model: GridModel;
  lenderId: string;
  coulmnDefinition: ColumnDefinition;
  userId: any;
  isDisable: boolean = false;
  userDetails: any;
  currentAction: string = 'Add';
  //Commenting these changes as these were added for add modal and now that functionality is removed
  //addEditUser: FormGroup;
  requestModel: any;
  headerText: any = "User";
  rolesList: any[];
  parentBorrowersList: any[];
  salesRegionsList: any[];
  startTimeInMinutes: any;
  endTimeInMinutes: any;
  currentDate: Date = new Date();
  isUserLoginValid: boolean = true;
  isUserNameValid: boolean = true;
  isPhoneNoValid: boolean = true;
  isEmailValid: boolean = true;
  userType: string = "N";
  startDate: string = " ";
  endDate: string = " ";
  message: string;
  hourStart: any;
  minutesStart: any;
  hourEnd: any;
  minutesEnd: any;
  userscreenPermissions: any;
  userEditPermission: boolean = true;
  saveNew: boolean = false;
  showUnlockAccountColumn: any;
  hideUnlockAccount = true;
  tNCEnabled: boolean = false;

  constructor(private rolesPermComp: CheckPermissionsService,
    private _grid: GridComponent,
    private _location: Location,
    private _message: MessageServices,
    private formvalidationService: FormvalidationService,
    private fb: FormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    private _service: CustomHttpService,
    private config: AppConfig) {
    this.lenderId = this.config.getConfig('lenderId');
    let automaticMail = CyncConstants.getAutomaticMailValue();
    if (automaticMail == "D") {
      this.hideUnlockAccount = false
    }
    this.model = {
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      apiDef: { getApi: 'admin/users?sidx=updated_at&sord=desc', deleteApi: '', updateApi: '/v1/lenders/' + this.lenderId + '' },
      type: 'Users',
      columnDef: [
        { field: 'login', header: 'User Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'user_name', header: 'Display Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'sales_region', header: 'Sales Region', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'role_display', header: 'Role', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'phone_no', header: 'Phone No', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'email', header: 'Email', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'client_name', header: 'Client', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'user_type', header: 'User Type', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 't_and_c_status', header: 'T & C', sortable: true, isTemplate: false, templateHtml: '', hidden: !this.tNCEnabled, filter: true },
        { field: 'active', header: 'Status', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'resend_activation_email', header: 'Activation Email', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
        { field: 'unlock_account', header: 'Unlock Account', sortable: true, isTemplate: false, templateHtml: '', hidden: this.hideUnlockAccount, filter: false }
      ]
    }

    this.userscreenPermissions = JSON.parse(localStorage.getItem("userCreationPermissionsArray"));
    this.userEditPermission = this.rolesPermComp.checkPermissions(this.userscreenPermissions, "update");

  }

  async ngOnInit() {
    $("#cync_app_dashboard").removeClass("loading-modal-initial");
    this._service.setHeight();
    await this.setTncStatus();
  }


  setTncStatus(){
    try{
      this._service.getCall('legal_texts?reference=GENERAL&text_type=t_and_c_USER').then(i => {
       this.model.columnDef.filter(x => x.field == "t_and_c_status")[0].hidden = (this._service.bindData(i).enabled == false ? true : false);
      })
    }catch (e){
      console.log(e);
    }
  }


  navigateToHome() {
    // this._service.invokeGetMethod();
    this._message.showLoader(false);
    if (this.isDisable && this.message === 'Edit') {
      this._message.addSingle("Record updated successfully.", "success");
    } else {
      this._message.addSingle("Record saved successfully.", "success");
    }
    if (this.saveNew) {
      (<any>$('#userModal')).find('input').val('');
      (<any>$('#userModal')).find('select').prop('selectedIndex', 0);
      this.saveNew = false;
    } else {
      (<any>$('#userModal')).modal('hide');
    }

  }

  navigateToHomeCancel() {
    //this._location.back();   
    (<any>$('#userModal')).modal('hide');
  }


  saveNewfn() {
    this.saveNew = true;
  }

}
