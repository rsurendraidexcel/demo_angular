import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgForm, AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { AdvanceSearch, Column, Opearator, Dropdown } from './advance-search-popup.model';
import { Helper } from '@cyncCommon/utils/helper';
import { StringUtils } from '@app/shared/utilities/string-utils';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { AdvanceSearchPoupService } from '@app/shared/components/advance-search-popup/advance-search-popup.service';
import { MessageServices } from '@cyncCommon/component/message/message.component';

@Component({
  selector: 'advance-search-popup',
  templateUrl: './advance-search-popup.component.html',
  styleUrls: ['./advance-search-popup.component.scss']
})
export class AdvanceSearchPopupComponent implements OnInit {
  myForm: FormGroup;
  requestParam: any;
  columns: any[];
  columnDataType: any;
  operators: any[];
  selectedField: Column;


  constructor(public dialogRef: MatDialogRef<AdvanceSearchPopupComponent>,
    private _fb: FormBuilder,
    private _advanceSearchPopupService: AdvanceSearchPoupService,
    private _apiMapper: APIMapper,
    private _msgServices: MessageServices,
    private _helper: Helper,
    @Inject(MAT_DIALOG_DATA) data) {
    this.requestParam = data;
  }

  ngOnInit() {
    this._msgServices.showLoader(true);
    this.myForm = this._fb.group({
      allowSearch: new FormControl(false, Validators.compose([Validators.required])),
      groupOp: new FormControl('AND', Validators.compose([Validators.required])),
      advanceSearchForms: this._fb.array([]),
    });
    this.getColumns();
    this.persistSearchToModel();
  }


  private addFirstRow() {
    this.addRow();
  }


  addRow() {
    const control = <FormArray>this.myForm.controls['advanceSearchForms'];
    const addrCtrl = this.initFormControls();
    control.push(addrCtrl);
    //  this._msgServices.showLoader(false);
  }

  initFormControls() {
    return this._fb.group({
      data: new FormControl('', Validators.compose([Validators.required])),
      field: new FormControl('', Validators.compose([Validators.required])),
      op: new FormControl('', Validators.compose([Validators.required])),
      operators: new FormControl('', Validators.compose([Validators.required])),
      dropdown: new FormControl('', Validators.compose([Validators.required])),
      searchColumnType: new FormControl('', Validators.compose([Validators.required])),


    });
  }

  /**
   * return list of column names for the page we are performing the advanced search.
   */
  private getColumns() {
    this._advanceSearchPopupService.getColumnList(this.requestParam.apiModel.columnAPI)
      .subscribe(columnList => {
        this.columns = columnList.columns;
        this._msgServices.showLoader(false);
      });
  }

  /**
   * This method will return the list of operators
   * @param advanceSearchGroup , selected row
   * @param dataType , the datatype of the selectd column for the advanceSearchGroup.
   */
  private getOperators(advanceSearchGroup: FormGroup, dataType: string) {
    let operatorEndPoint = this.requestParam.apiModel.operatorAPI;
    operatorEndPoint = operatorEndPoint.replace('{data_type}', dataType);
    this._advanceSearchPopupService.getOperatorList(operatorEndPoint)
      .subscribe(operatorList => {
        advanceSearchGroup.controls['operators'].setValue(<Opearator[]>operatorList.operator);
        this._msgServices.showLoader(false);
      });
  }

  /**
 * This method will return the list of dropdown values for the selectd column
 * @param advanceSearchGroup , selected row
 * @param searchColumn , Selected column name.
 */
  private getDropdownValue(advanceSearchGroup: FormGroup, searchColumn: string) {
    this._msgServices.showLoader(true);
    let dropdownEndPoint = this.requestParam.apiModel.dropdownAPI;
    dropdownEndPoint = dropdownEndPoint.replace('{column_value}', searchColumn);
    this._advanceSearchPopupService.getDropdownList(dropdownEndPoint)
      .subscribe(dropdownList => {
        advanceSearchGroup.controls['dropdown'].setValue(<Dropdown[]>dropdownList.drop_down);
        this._msgServices.showLoader(false);
      });

  }
  /**
   * This method will set the operators and drop down values for the selectd column.
   * @param index , index of the row.
   */
  private onChangeOfColumnName(index: number) {
    this._msgServices.showLoader(true);
    let advSearchArray = <FormArray>this.myForm.get('advanceSearchForms');
    const advanceSearchGroup = <FormGroup>advSearchArray.controls[index];
    let searchColumn = advanceSearchGroup.controls.field.value;
    this.selectedField = <Column>this.columns.filter(
      col => col.column_value === searchColumn)[0];

    let dataType = this.selectedField.data_type;
    let searchType = this.selectedField.search_type;
    advanceSearchGroup.controls['searchColumnType'].setValue(searchType);
    this.getOperators(advanceSearchGroup, dataType);
    if (searchType == 'drop_down') {
      this.getDropdownValue(advanceSearchGroup, searchColumn);
    } else {
      advanceSearchGroup.controls['data'].setValue('');
    }

  }
  /**
   * This method will create default search field for the advanced search popup, Previously inserted data should also be bind,
   * if user already searched or inserted data to the search fields.
   */
  persistSearchToModel() {
    if (this.requestParam.persistedAdvanceSearch.length == 0) {
      this.addFirstRow();
    } else {
      const control = <FormArray>this.myForm.controls['advanceSearchForms'];
      this.myForm.get("groupOp").setValue(this.requestParam.persistedAdvanceSearch.get('groupOp').value);
      this.requestParam.persistedAdvanceSearch.get('advanceSearchForms').value.forEach(element => {
        let fb = this.initFormControls();
        fb.patchValue(element);
        control.push(fb);
      });
    }



  }

  removeRow(i: number) {
    const control = <FormArray>this.myForm.controls['advanceSearchForms'];
    control.removeAt(i);
  }

  closePopup(form: FormGroup) {
    form.get('allowSearch').setValue(false);
    this.dialogRef.close(form);
  }

  /**
  * Method to hightlight mandatory fileds if form validations fail
  * @param field 
  */
  displayCssField(index: number, field: string) {
    return this._helper.getFieldCss(field, this.myForm.controls['advanceSearchForms']['controls'][index]);
  }

  /**
  * Get Form Control field
  * @param field 
  */
  getFormControl(index: number, field: string) {
    return this.myForm.controls['advanceSearchForms']['controls'][index].get(field);
  }


  save(form: FormGroup) {
    let model = <FormArray>form.get('advanceSearchForms').value;
    form.get('allowSearch').setValue(true);
    let errMsg = 'please select something for search';
    let errTitle = 'advance search error';
    let anyIssue = false;
    for (let i = 0; i < model.length; i++) {
      if (StringUtils.isEmptyOrNull(model[i].field)) {
        errMsg = 'Please select field to search';
        anyIssue = true;
        break;
      }
      if (StringUtils.isEmptyOrNull(model[i].op)) {
        errMsg = 'Please select operator to search';
        anyIssue = true;
        break;
      }
      if (StringUtils.isEmptyOrNull(model[i].data)) {
        errMsg = 'Please select value to search';
        anyIssue = true;
        break;
      }
    }

    if (anyIssue || model.length == 0) {
      this._helper.openAlertPoup(errTitle, errMsg);
    } else {
      this.dialogRef.close(form);
    }
  }

  /**
   * Method to return Form Array control
   * to display multiple column Fields
   */
  get advanceSearchFormsControls() {
    return <FormArray>this.myForm.get('advanceSearchForms');
  }

  reset() {
    const advanceSearchArry = <FormArray>this.myForm.controls.advanceSearchForms;//['advanceSearchForms'];
    let fb = this.initFormControls();
    advanceSearchArry.controls = [];
    advanceSearchArry.push(fb);
  }


}
