import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { UserPermission } from '@app/shared/models/user-permissions.model';
import { Observable } from 'rxjs/Observable';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { Helper } from '@cyncCommon/utils/helper';
import { RouterConstants } from '@cyncCommon/utils//router-constants';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.css']
})

/**
 * @author Raushan Kumar
 */
export class UploadsComponent implements OnInit {
  isBBCDataFileViewPermitted: boolean;
  isOtherRequiredDocumentPermitted: boolean;
  isAutoFileUploadPermitted: boolean;
  selectedRadioBtn: string = CyncConstants.ABL_FILE_UPLOAD_VALUE;
  isClientSelected: boolean;

  constructor(private _router: Router,
    private _commonApiHelper: CommonAPIs,
    private _helper: Helper, private location: Location) {
  }

  ngOnInit() {
    if (this._helper.isClientSelected()) {
      this.getPermissionsResponse();
      this.isClientSelected = true;
    }
  }

  /**
   * This method will get menu permissionsresponse based on user logged in
   */
  getPermissionsResponse() {
    const roleType = localStorage.getItem(CyncConstants.CYNC_USER_ROLE);
    if (!this._helper.compareIgnoreCase(roleType, CyncConstants.ADMIN_ROLE_TYPE)) {
      forkJoin(
        this.getBBCDataFileMenuPermission(),
        this.getOtherRequiredFileMenuPermission(),
        this.getAutoFileUploadMenuPermission()
      ).subscribe(result => {
        this.isBBCDataFileViewPermitted = this.getBBCDataFileViewPermission(result[0]);
        this.isOtherRequiredDocumentPermitted = this.getOtherRequiredFileViewPermission(result[1]);
        this.isAutoFileUploadPermitted = this.getAutoFileUploadViewPermission(result[2]);
        this.navigateBasedOnpermissions(this.isBBCDataFileViewPermitted,
          this.isOtherRequiredDocumentPermitted, this.isAutoFileUploadPermitted);
      });
    } else {
      this.isBBCDataFileViewPermitted = true;
      this.isOtherRequiredDocumentPermitted = true;
      this.isAutoFileUploadPermitted = true;
      this.navigateBasedOnpermissions(this.isBBCDataFileViewPermitted,
        this.isOtherRequiredDocumentPermitted, this.isAutoFileUploadPermitted);
    }
  }

  /**
   * Method to get the BBC Data File Menu Permissions
   */
  getBBCDataFileMenuPermission(): Observable<UserPermission[]> {
    const userRoleId = localStorage.getItem(CyncConstants.CYNC_USER_ROLE_ID); /*Logged In User*/
    return this._commonApiHelper.getUserPermission(CyncConstants.ABL_FILE_UPLOAD_MENU_NAME, userRoleId);
  }

  /**
   * Method to get user have Permissions to view data or not ?
   * @param permissionsArray
   */
  getBBCDataFileViewPermission(permissionsArray: any[]): boolean {
    const permissionObj: UserPermission = this._helper.getPermissionObject(permissionsArray, CyncConstants.ABL_VIEW);
    let bbcDataViewPermission = false;
    if (permissionObj !== undefined) {
      bbcDataViewPermission = permissionObj[CyncConstants.ENABLED_KEY];
    }
    return bbcDataViewPermission;
  }

  /**
   * Method to get the BBC Data File Menu Permissions
   */
  getOtherRequiredFileMenuPermission(): Observable<UserPermission[]> {
    const userRoleId = localStorage.getItem(CyncConstants.CYNC_USER_ROLE_ID); /*Logged In User*/
    return this._commonApiHelper.getUserPermission(CyncConstants.OTHER_REQUIRED_FILE, userRoleId);
  }

  /**
   * Method to get user have Permissions to view data or not ?
   * @param permissionsArray
   */
  getOtherRequiredFileViewPermission(permissionsArray: any[]): boolean {
    const permissionObj: UserPermission = this._helper.getPermissionObject(permissionsArray, CyncConstants.OTHER_REQUIRED_DOC_VIEW);
    let otherRequiredDocViewPermission = false;
    if (permissionObj !== undefined) {
      otherRequiredDocViewPermission = permissionObj[CyncConstants.ENABLED_KEY];
    }
    return otherRequiredDocViewPermission;
  }

  /**
   * Method to get the BBC Data File Menu Permissions
   */
  getAutoFileUploadMenuPermission(): Observable<UserPermission[]> {
    const userRoleId = localStorage.getItem(CyncConstants.CYNC_USER_ROLE_ID); /*Logged In User*/
    return this._commonApiHelper.getUserPermission(CyncConstants.AUTO_FILE_UPLOAD, userRoleId);
  }

  /**
   * Method to get user have Permissions to view data or not ?
   * @param permissionsArray
   */
  getAutoFileUploadViewPermission(permissionsArray: any[]): boolean {
    const permissionObj: UserPermission = this._helper.getPermissionObject(permissionsArray, CyncConstants.AUTO_FILE_UPLOAD_VIEW);
    let autoFileViewPermission = false;
    if (permissionObj !== undefined) {
      autoFileViewPermission = permissionObj[CyncConstants.ENABLED_KEY];
    }
    return autoFileViewPermission;
  }

  /**
   * This method will disable or enable radio button based on permissions
   * @param isBBCDataViewPermitted
   * @param isOtherRequiredDocViewPermitted
   * @param isAutoFileViewPermitted
   */
  navigateBasedOnpermissions(isBBCDataViewPermitted: boolean, isOtherRequiredDocViewPermitted: boolean, isAutoFileViewPermitted: boolean) {
    if (this._router.url === RouterConstants.OTHER_REQUIRED_DOC_ROUTER && isOtherRequiredDocViewPermitted) {
      this._router.navigateByUrl(RouterConstants.OTHER_REQUIRED_DOC_ROUTER);
      this.selectedRadioBtn = CyncConstants.OTHER_REQUIRED_DOC_VALUE;
    } else if (this._router.url === RouterConstants.AUTO_FILE_UPLOAD_ROUTER && isAutoFileViewPermitted) {
      this._router.navigateByUrl(RouterConstants.AUTO_FILE_UPLOAD_ROUTER);
      this.selectedRadioBtn = CyncConstants.AUTO_FILE_UPLOAD_VALUE;
    } else if (isBBCDataViewPermitted) {
      this._router.navigateByUrl(RouterConstants.BBC_FILE_UPLOAD_ROUTER);
      this.selectedRadioBtn = CyncConstants.ABL_FILE_UPLOAD_VALUE;
    } else if (isOtherRequiredDocViewPermitted) {
      this._router.navigateByUrl(RouterConstants.OTHER_REQUIRED_DOC_ROUTER);
      this.selectedRadioBtn = CyncConstants.OTHER_REQUIRED_DOC_VALUE;
    } else if (isAutoFileViewPermitted) {
      this._router.navigateByUrl(RouterConstants.AUTO_FILE_UPLOAD_ROUTER);
      this.selectedRadioBtn = CyncConstants.AUTO_FILE_UPLOAD_VALUE;
    }
  }
}