import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { Router } from '@angular/router';
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CheckPermissionsService } from '../../../../app-common/component/roles-and-permissions/check-permissions.service';
import { navbarComponent } from '../../../navbar/navbar.component';
import { CyncConstants } from 'app-common/utils/constants';

@Component({
  selector: 'app-global-setting',
  templateUrl: './global-setting.component.html'
})
export class GlobalSettingComponent implements OnInit {

  lenderId: string;
  globalSettingDetails: any;
  ablLength: number;
  factoringLength: number;
  requestModel: any;
  changedValueABL: string = "S";
  changedValueFACT: string = "S";
  isDisable: boolean = true;
  ablArray: any[] = [];
  factoringArray: any[] = [];
  selectedAblValue: any[] = [];
  selectedFactoringValue: any[] = [];
  dataCollection: any[] = [];
  globalSettingsPermArr: any[] = [];
  hasPermission: boolean = true;


  url = 'lender_notifications';

  constructor(private rolesPermComp: CheckPermissionsService, private _location: Location, private _message: MessageServices, private _router: Router, private route: ActivatedRoute, private _service: CustomHttpService, private config: AppConfig, private _navbar: navbarComponent) {

    /*Based on the User Role Permissions Enable or Disable the Edit Icon*/
    let userRole = localStorage.getItem('cyncUserRole');/*Logged In User*/
    if (userRole !== CyncConstants.ADMIN_ROLE_TYPE) {
      /*Permission checking is not applicable for Admin hence checking the roleId is whether 1*/
      setTimeout(() => {
        this.globalSettingsPermArr = JSON.parse(localStorage.getItem("globalSettingsPermissionsArray"));
        this.hasPermission = this.rolesPermComp.checkPermissions(this.globalSettingsPermArr, "save_lender_notifications");
      }, 600);
    }

    this.lenderId = this.config.getConfig('lenderId');
    this.showData(this.url);
  }

  ngOnInit() {
    this._service.setHeight();
    this._message.showLoader(true);
    this._navbar.getUpdatedAngularMenuAndBreadCrumb();
    // $('#routerLinkId').addClass('active');
    // if (this._navbar.angularMenu !== undefined) this._navbar.angularMenu[0].path = '/notificationCenter/global-setting';
  }

  showData(tempUrl) {
    this._service.getCall(tempUrl).then(i => {
      this.globalSettingDetails = this._service.bindData(i).lender_notifications;
      this.ablArray = [];
      this.factoringArray = [];
      this.selectedAblValue = [];
      this.selectedFactoringValue = [];
      for (let j = 0; j < this.globalSettingDetails.length; j++) {

        if (this.globalSettingDetails[j].module_name == 'ABL') {
          this.ablArray.push(this.globalSettingDetails[j]);

          if (this.globalSettingDetails[j].email == true && this.globalSettingDetails[j].text == true) {
            this.selectedAblValue.push('B');
          }
          else if (this.globalSettingDetails[j].email == true && this.globalSettingDetails[j].text == false) {
            this.selectedAblValue.push('E');
          }
          else if (this.globalSettingDetails[j].email == false && this.globalSettingDetails[j].text == true) {
            this.selectedAblValue.push('T');
          }
          else
            this.selectedAblValue.push('S');
        }

        else if (this.globalSettingDetails[j].module_name == 'FACTORING') {
          this.factoringArray.push(this.globalSettingDetails[j]);

          if (this.globalSettingDetails[j].email == true && this.globalSettingDetails[j].text == true) {
            this.selectedFactoringValue.push('B');
          }
          else if (this.globalSettingDetails[j].email == true && this.globalSettingDetails[j].text == false) {
            this.selectedFactoringValue.push('E');
          }
          else if (this.globalSettingDetails[j].email == false && this.globalSettingDetails[j].text == true) {
            this.selectedFactoringValue.push('T');
          }
          else
            this.selectedFactoringValue.push('S');
        }
      }
      /* let flagAbl = 0;
       for(var k=0 ; k<this.selectedAblValue.length; k++){
          if(this.selectedAblValue[k] == "B"){
              flagAbl++;
          }
        }
        if(this.selectedAblValue.length == flagAbl){
          this.changedValueABL = "B";
          this.isDisable = false;
        }else{
          this.changedValueABL = false;
        }

        let flagFact =0;
        for(var k=0 ; k<this.selectedFactoringValue.length; k++){
          if(this.selectedFactoringValue[k] == "B"){
              flagFact++;
          }
        }
        if(this.selectedFactoringValue.length == flagFact){
          this.changedValueFACT = true;
           this.isDisable = false;
        }else{
          this.changedValueFACT = false;
        }*/
    });
  }


  selectAllForAbl(event) {
    this.changedValueABL = event;
    this.ablLength = this.selectedAblValue.length;
    this.selectedAblValue = [];
    if (event == "B") {
      for (var k = 0; k < this.ablLength; k++) {
        this.selectedAblValue.push("B");
      }
      if (this.hasPermission) { this.isDisable = false; }
    } else if (event == "T") {
      for (var k = 0; k < this.ablLength; k++) {
        this.selectedAblValue.push("T");
      }
      if (this.hasPermission) { this.isDisable = false; }
    } else if (event == "E") {
      for (var k = 0; k < this.ablLength; k++) {
        this.selectedAblValue.push("E");
      }
      if (this.hasPermission) { this.isDisable = false; }
    } else if (event == "S") {
      for (var k = 0; k < this.ablLength; k++) {
        this.selectedAblValue.push("S");
      }
      if (this.hasPermission) { this.isDisable = false; }
    }
    else {
      this.showData(this.url);
      this.isDisable = true;
    }
  }

  selectAllForFactoring(event) {

    this.changedValueFACT = event;
    this.factoringLength = this.selectedFactoringValue.length;
    this.selectedFactoringValue = [];
    if (event == "B") {
      for (var k = 0; k < this.factoringLength; k++) {
        this.selectedFactoringValue.push("B");
      }
      if (this.hasPermission) { this.isDisable = false; }
    } else if (event == "T") {
      for (var k = 0; k < this.factoringLength; k++) {
        this.selectedFactoringValue.push("T");
      }
      if (this.hasPermission) { this.isDisable = false; }
    } else if (event == "E") {
      for (var k = 0; k < this.factoringLength; k++) {
        this.selectedFactoringValue.push("E");
      }
      if (this.hasPermission) { this.isDisable = false; }
    } else if (event == "S") {
      for (var k = 0; k < this.factoringLength; k++) {
        this.selectedFactoringValue.push("S");
      }
      if (this.hasPermission) { this.isDisable = false; }
    } else {
      this.showData(this.url);
      this.isDisable = true;
    }
  }

  onChangeForAbl(selected: any) {
    for (var unselectCheckBoxABL = 0; unselectCheckBoxABL < this.ablArray.length; unselectCheckBoxABL++) {
      if ((<HTMLInputElement>document.getElementById('typeValueABL' + unselectCheckBoxABL)).value != selected) {
        this.changedValueABL = "S";
        if (this.hasPermission) { this.isDisable = false; }
      }
    }
  }

  onChangeForFactoring(selected: any) {
    for (var unselectCheckBoxFACT = 0; unselectCheckBoxFACT < this.factoringArray.length; unselectCheckBoxFACT++) {
      if ((<HTMLInputElement>document.getElementById('typeValueFACT' + unselectCheckBoxFACT)).value != selected) {
        this.changedValueFACT = "S";
        if (this.hasPermission) { this.isDisable = false; }
      }
    }
  }

  saveData() {
    for (let settingsFACT = 0; settingsFACT < this.factoringArray.length; settingsFACT++) {
      if ((<HTMLInputElement>document.getElementById('typeValueFACT' + settingsFACT)).value == 'T') {
        this.factoringArray[settingsFACT].text = true;
        this.factoringArray[settingsFACT].email = false;
      } else if ((<HTMLInputElement>document.getElementById('typeValueFACT' + settingsFACT)).value == 'E') {
        this.factoringArray[settingsFACT].text = false;
        this.factoringArray[settingsFACT].email = true;
      } else if ((<HTMLInputElement>document.getElementById('typeValueFACT' + settingsFACT)).value == 'B') {
        this.factoringArray[settingsFACT].text = true;
        this.factoringArray[settingsFACT].email = true;
      } else {
        this.factoringArray[settingsFACT].text = false;
        this.factoringArray[settingsFACT].email = false;
      }
      if (this.hasPermission) { this.isDisable = false; }
    }

    for (let settingsABL = 0; settingsABL < this.ablArray.length; settingsABL++) {
      if ((<HTMLInputElement>document.getElementById('typeValueABL' + settingsABL)).value == 'T') {
        this.ablArray[settingsABL].text = true;
        this.ablArray[settingsABL].email = false;
      } else if ((<HTMLInputElement>document.getElementById('typeValueABL' + settingsABL)).value == 'E') {
        this.ablArray[settingsABL].text = false;
        this.ablArray[settingsABL].email = true;
      } else if ((<HTMLInputElement>document.getElementById('typeValueABL' + settingsABL)).value == 'B') {
        this.ablArray[settingsABL].text = true;
        this.ablArray[settingsABL].email = true;
      } else {
        this.ablArray[settingsABL].text = false;
        this.ablArray[settingsABL].email = false;
      }
      if (this.hasPermission) { this.isDisable = false; }
    }

    const mergeArray = this.ablArray.concat(this.factoringArray);
    for (let setModel = 0; setModel < mergeArray.length; setModel++) {
      this.dataCollection.push({
        'id': mergeArray[setModel].email_list_id,
        'email': mergeArray[setModel].email,
        'text': mergeArray[setModel].text
      });
    }
    const globalSettingsModel = {
      "lender_notifications": this.dataCollection
    }
    this.requestModel = { url: 'lender_notifications/', model: globalSettingsModel };
    this._service.postCallpatch(this.requestModel).then(i => {
      this.navigateToHome();
      if (i != undefined) {
        this.navigateToHome();
      }
    });

  }

  navigateToHome() {
    this.isDisable = true;
    this._message.showLoader(false);
    this._message.addSingle("Record saved successfully.", "success");
    this.showData(this.url);
    /* document.getElementById("factID").classList.add('collapsed');
     document.getElementById("ablID").classList.add('collapsed');
     document.getElementById("collapseThree").classList.remove("in");
     document.getElementById("collapseTwo").classList.remove("in"); */
  }

  cancelGlobalSetting() {
    this.isDisable = true;
    document.getElementById('factID').classList.add('collapsed');
    document.getElementById('ablID').classList.add('collapsed');
    document.getElementById('collapseThree').classList.remove('in');
    document.getElementById('collapseTwo').classList.remove('in');
    this._message.showLoader(true);
    this.showData(this.url);
    this.changedValueABL = "S";
    this.changedValueFACT = "S";

  }
}
