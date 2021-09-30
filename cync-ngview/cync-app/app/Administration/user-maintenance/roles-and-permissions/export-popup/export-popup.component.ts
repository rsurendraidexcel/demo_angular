import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CheckboxModule } from 'primeng/primeng';
import { NgForm, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MessageServices } from '../../../../../app-common/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-export-popup',
  templateUrl: './export-popup.component.html',
  styleUrls: ['./export-popup.component.scss']
})
export class ExportPopupComponent implements OnInit {

  menuPermissionArray: any;
  checked: boolean = true
  exportForm: FormGroup;
  exportArray: any;
  parentArray: any;
  childArray: any;
  roleId: string;

  constructor(
    public dialogRef: MatDialogRef<ExportPopupComponent>,
    private fb: FormBuilder,
    private _message: MessageServices,
    private _helper: Helper,
    private _cyncHttpService: CyncHttpService) { }

  ngOnInit() {
    this.createForm();
    this.getMenuPermissionArray();
  }

  /**
	* on click of export button
	*/
  onClickExportButton(model: any) {
    this.parentArray = [];
    this.childArray = [];
    for (let i = 0; i < model.menuPermissionArray.length; i++) {
      if (model.menuPermissionArray[i].isParentChecked) {
        this.parentArray.push(model.menuPermissionArray[i].sub_menu_id)
        for (let j = 0; j < model.menuPermissionArray[i].submenu_list.length; j++) {
          if (model.menuPermissionArray[i].submenu_list[j].isChildChecked) {
            this.childArray.push(model.menuPermissionArray[i].submenu_list[j].sb_sub_menu_id);
          }
        }
      } else {
        for (let j = 0; j < model.menuPermissionArray[i].submenu_list.length; j++) {
          if (model.menuPermissionArray[i].submenu_list[j].isChildChecked) {
            this.childArray.push(model.menuPermissionArray[i].submenu_list[j].sb_sub_menu_id);
          }
        }
      }
    }
    const request = {
      "menu_ids": this.childArray,
      "parent_ids": this.parentArray
    }
    this.callExportApi(request);
  }

  callExportApi(request: any) {
    if (this.childArray.length == 0 && this.parentArray.length == 0) {
      //this._message.addSingle('Please select data to export', "error");
      alert("Please select column to export");
    } else {
      this._message.showLoader(true);
      this.exportData('roles/'+this.roleId+'/role_permissions/export_menu_permissions', request).subscribe(blob => {
        this._helper.downloadFile(blob, 'Roles_and_permission');
        this._message.showLoader(false);
        this.onClickCloseButton();
      });
    }
  }

  /**
   * Method to export data
   * @param queryParams
   * @param url
   */
  exportData(url: string, model: any): Observable<Blob> {
    return this._cyncHttpService.patchExportCall(url, model);
  }

  /**
	* Initialize form
	*/
  createForm() {
    this.exportForm = this.fb.group({
      'menuPermissionArray': this.fb.array([])
    });
  }

  /**
	* Initialize parent Menu Data
	*/
  initializeParentMenuData() {
    return this.fb.group({
      "sub_menu_id": new FormControl(),
      "sub_menu_name": new FormControl(),
      "isParentChecked": new FormControl(true),
      "menu_identifier": new FormControl(),
      "submenu_count": new FormControl(),
      "submenu_list": this.fb.array([]),
    });
  }

  /**
* Initialize Child Menu Data
*/
  initializeChildMenuData() {
    return this.fb.group({
      "sb_sub_menu_id": new FormControl(),
      "sb_sub_menu_name": new FormControl(),
      "isChildChecked": new FormControl(true),
      "menu_identifier": new FormControl(),
      "submenu_count": new FormControl(),
      "submenu_list": new FormControl(),
      "permissions": new FormControl(),

    });
  }

  /**
  * Patch Parameter Data Object
  */
  patchParameterData(parameterFormArray: FormArray, parameterDataList: any[]) {
    for (let i = 0; i < parameterDataList.length; i++) {
      const parameterData = parameterDataList[i];
      const parameterFormGroup = this.initializeParentMenuData();
      parameterFormGroup.patchValue(parameterData);
      this.patchData(<FormArray>parameterFormGroup.controls['submenu_list'], parameterData['submenu_list']);
      parameterFormArray.push(parameterFormGroup);
    }
  }

	/**
	  * Patch Data Object
	  */
  patchData(dataFormArray: FormArray, dataList: any[]) {
    for (let j = 0; j < dataList.length; j++) {
      const data = dataList[j];
      const dataGroup = this.initializeChildMenuData();
      dataGroup.patchValue(data);
      dataFormArray.push(dataGroup);
    }
  }

  /**
	* On click of cancel button
	*/
  onClickCloseButton(): void {
    this.dialogRef.close();
  }

  /**
	* On check parent menu checkbox
	*/
  onCheckParentMenu(event: any, menuName: string, id: string, i: number) {
    let length = this.exportForm.controls.menuPermissionArray['controls'][i].controls.submenu_list['controls'].length;
    if (event.target.checked) {
      for (let k = 0; k < length; k++) {
        this.exportForm.controls.menuPermissionArray['controls'][i].controls.submenu_list['controls'][k].controls.isChildChecked.setValue(true);
      }
    } else {
      for (let k = 0; k < length; k++) {
        this.exportForm.controls.menuPermissionArray['controls'][i].controls.submenu_list['controls'][k].controls.isChildChecked.setValue(false);
      }
    }
  }

  /**
	* On check child menu checkbox
	*/
  onCheckSubMenu(event: any, menuName: string, id: string, i: number, j: number) {
    let length = this.exportForm.controls.menuPermissionArray['controls'][i].controls.submenu_list['controls'].length;
    if (event.target.checked) {
      for (let k = 0; k < length; k++) {
        if (!this.exportForm.controls.menuPermissionArray['controls'][i].controls.submenu_list['controls'][k].controls.isChildChecked.value) {
          this.exportForm.controls.menuPermissionArray['controls'][i].controls.isParentChecked.setValue(false);
          break;
        }
        this.exportForm.controls.menuPermissionArray['controls'][i].controls.isParentChecked.setValue(true);
      }
    } else {
      this.exportForm.controls.menuPermissionArray['controls'][i].controls.isParentChecked.setValue(false);
    }
  }

  /**
	* Get form data
	*/
  getMenuPermissionArray() {
    this.roleId = this._helper.getRolesAndPermissionId();
    this.menuPermissionArray = this._helper.getRolesAndPermissionArray();
    this.exportForm.patchValue(this.menuPermissionArray);
    this.patchParameterData(<FormArray>this.exportForm.controls.menuPermissionArray, this.menuPermissionArray);
  }

  /**
	* to select all check box
	*/
  onCheckSelectAll(event: any, model: any) {
    if (event.target.checked) {
      for (let i = 0; i < model.menuPermissionArray.length; i++) {
        this.exportForm.controls.menuPermissionArray['controls'][i].controls.isParentChecked.setValue(true);
        let length = this.exportForm.controls.menuPermissionArray['controls'][i].controls.submenu_list['controls'].length;
        for (let k = 0; k < length; k++) {
          this.exportForm.controls.menuPermissionArray['controls'][i].controls.submenu_list['controls'][k].controls.isChildChecked.setValue(true);
        }
      }
    } else {
      for (let i = 0; i < model.menuPermissionArray.length; i++) {
        this.exportForm.controls.menuPermissionArray['controls'][i].controls.isParentChecked.setValue(false);
        let length = this.exportForm.controls.menuPermissionArray['controls'][i].controls.submenu_list['controls'].length;
        for (let k = 0; k < length; k++) {
          this.exportForm.controls.menuPermissionArray['controls'][i].controls.submenu_list['controls'][k].controls.isChildChecked.setValue(false);
        }
      }
    }
  }

}
