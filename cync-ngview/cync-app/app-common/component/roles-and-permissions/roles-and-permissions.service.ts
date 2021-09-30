import { Injectable } from '@angular/core';
import { CustomHttpService } from '../../services/http.service';

@Injectable()
export class RolesAndPermissionService {

  loggedInUserPermissionsArray: any[] = [];
  salesRegionsPermissionsArray: any[] = [];
  naicsCodesPermissionsArray: any[] = [];
  commentTypesPermissionsArray: any[] = [];
  systemParametersPermissionsArray: any[] = [];
  adjustmentReasonsPermissionsArray: any[] = [];
  currencyDefPermissionsArray: any[] = [];
  currencyPairPermissionsArray: any[] = [];
  rateTypePermissionsArray: any[] = [];
  exchangeRatePermissionsArray: any[] = [];
  currencyHolidayPermissionsArray: any[] = [];
  userCreationPermissionsArray: any[] = [];
  basicDetailsPermissionsArray: any[] = [];
  bankDetailsPermissionsArray: any[] = [];
  interestCalendarPermissionsArray: any[] = [];
  reportTemplatesPermissionsArray: any[] = [];
  contentPermissionsArray: any[] = [];
  templatesPermissionsArray: any[] = [];
  roleSettingsPermissionsArray: any[] = [];
  globalSettingsPermissionsArray: any[] = [];
  userSettingsPermissionsArray: any[] = [];
  rolesAndPermissionsArray: any[] = [];

  constructor() {

  }

  savePermissionsInLocalStorage(responseData: any) {
    /*Get Logged In User RoleId*/
    let userRole = localStorage.getItem('cyncUserRole');
    /*Get all the Menu Permissions based on the roleId */
    //this._service.getCall('roles/'+userRole+'/role_permissions/all_menu_permissions').then(res =>{
    //let responseData:any[] = this._service.bindData(res);
    for (let i = 0; i < responseData.length; i++) {
      let tempArr = responseData[i];
      for (let j = 0; j < tempArr.length; j++) {
        let tempObj = tempArr[j];
        this.loggedInUserPermissionsArray.push(tempObj);
      }
    }

    if (this.loggedInUserPermissionsArray.length > 0) {

      /*Getting only Admin Menus and its sub menu permissions hence array[0] is used*/
      for (let k = 0; k < this.loggedInUserPermissionsArray[0].submenu_list.length; k++) {

        let tempObj = this.loggedInUserPermissionsArray[0].submenu_list[k];
        if (tempObj.submenu_count > 0) {

          /*Getting All Third Level and Fourth Level Menu Permissions*/
          let thirdLevelMenuArr: any[] = tempObj.submenu_list;
          for (let ind = 0; ind < thirdLevelMenuArr.length; ind++) {

            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'Sales Regions') {
              this.salesRegionsPermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("salesRegionsPermissionsArray", JSON.stringify(this.salesRegionsPermissionsArray));
            }
            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'NAICS Codes') {
              this.naicsCodesPermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("naicsCodesPermissionsArray", JSON.stringify(this.naicsCodesPermissionsArray));
            }
            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'Comment Types') {
              this.commentTypesPermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("commentTypesPermissionsArray", JSON.stringify(this.commentTypesPermissionsArray));
            }
            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'System Parameters') {
              this.systemParametersPermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("systemParametersPermissionsArray", JSON.stringify(this.systemParametersPermissionsArray));
            }
            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'Adjustment Reasons') {
              this.adjustmentReasonsPermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("adjustmentReasonsPermissionsArray", JSON.stringify(this.adjustmentReasonsPermissionsArray));
            }
            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'Currency Definition') {
              this.currencyDefPermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("currencyDefPermissionsArray", JSON.stringify(this.currencyDefPermissionsArray));
            }
            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'Currency Pair') {
              this.currencyPairPermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("currencyPairPermissionsArray", JSON.stringify(this.currencyPairPermissionsArray));
            }
            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'Rate Type') {
              this.rateTypePermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("rateTypePermissionsArray", JSON.stringify(this.rateTypePermissionsArray));
            }
            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'Exchange Rate') {
              this.exchangeRatePermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("exchangeRatePermissionsArray", JSON.stringify(this.exchangeRatePermissionsArray));
            }
            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'Currency Holiday') {
              this.currencyHolidayPermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("currencyHolidayPermissionsArray", JSON.stringify(this.currencyHolidayPermissionsArray));
            }
            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'User List') {
              this.userCreationPermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("userCreationPermissionsArray", JSON.stringify(this.userCreationPermissionsArray));
            }
            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'Basic Details') {
              this.basicDetailsPermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("basicDetailsPermissionsArray", JSON.stringify(this.basicDetailsPermissionsArray));
            }
            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'Bank Details') {
              this.bankDetailsPermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("bankDetailsPermissionsArray", JSON.stringify(this.bankDetailsPermissionsArray));
            }
            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'Interest Calendar') {
              this.interestCalendarPermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("interestCalendarPermissionsArray", JSON.stringify(this.interestCalendarPermissionsArray));
            }
            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'Report Templates') {
              this.reportTemplatesPermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("reportTemplatesPermissionsArray", JSON.stringify(this.reportTemplatesPermissionsArray));
            }
            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'Content') {
              this.contentPermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("contentPermissionsArray", JSON.stringify(this.contentPermissionsArray));
            }
            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'Templates') {
              this.templatesPermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("templatesPermissionsArray", JSON.stringify(this.templatesPermissionsArray));
            }
            if (thirdLevelMenuArr[ind].submenu_count > 0) {

              let fourthLevelMenuArr: any[] = thirdLevelMenuArr[ind].submenu_list;
              for (let pIndex = 0; pIndex < fourthLevelMenuArr.length; pIndex++) {
                if (fourthLevelMenuArr[pIndex].submenu_count == 0 && fourthLevelMenuArr[pIndex].sb_sb_sb_sub_menu_name == 'Role Settings') {
                  this.roleSettingsPermissionsArray = fourthLevelMenuArr[pIndex].permissions;
                  localStorage.setItem("roleSettingsPermissionsArray", JSON.stringify(this.roleSettingsPermissionsArray));
                }
                if (fourthLevelMenuArr[pIndex].submenu_count == 0 && fourthLevelMenuArr[pIndex].sb_sb_sb_sub_menu_name == 'Global Settings') {
                  this.globalSettingsPermissionsArray = fourthLevelMenuArr[pIndex].permissions;
                  localStorage.setItem("globalSettingsPermissionsArray", JSON.stringify(this.globalSettingsPermissionsArray));
                }
                if (fourthLevelMenuArr[pIndex].submenu_count == 0 && fourthLevelMenuArr[pIndex].sb_sb_sb_sub_menu_name == 'User Settings') {
                  this.userSettingsPermissionsArray = fourthLevelMenuArr[pIndex].permissions;
                  localStorage.setItem("userSettingsPermissionsArray", JSON.stringify(this.userSettingsPermissionsArray));
                }

              }/*3rd For Loop ends*/
            }/*If block ends*/

            if (thirdLevelMenuArr[ind].submenu_count == 0 && thirdLevelMenuArr[ind].sb_sb_sub_menu_name == 'Roles & Permissions') {
              this.rolesAndPermissionsArray = thirdLevelMenuArr[ind].permissions;
              localStorage.setItem("rolesAndPermissionsArray", JSON.stringify(this.rolesAndPermissionsArray));
            }

          }/*2nd For Loop ends*/

        }/*If block ends*/

      }/*1st For Loop ends*/

    } /*If block ends*/

    //}); /*Get Call ends*/

  }/* Method ends*/


}
