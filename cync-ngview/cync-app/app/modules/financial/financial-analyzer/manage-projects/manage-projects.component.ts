import { Component, OnInit } from '@angular/core';
import { Helper } from '@cyncCommon/utils/helper';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray, ValidatorFn, FormControlName } from '@angular/forms';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { ListProjectService } from '../service/list-project.service';
import { AllListProject, ListProject, AddEditListProject, Dropdown, Dropdown1 } from '../model/list-project.model';

import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import { FormValidationService } from '@cyncCommon/cync-form-validator/form-validation.service';
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';
import { Observable } from 'rxjs/Observable';
import { forkJoin, of, interval } from 'rxjs';
import { SelectDropDown } from '@app/shared/models/select-dropdown.model';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { Subscription } from 'rxjs/Subscription';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrls: ['./manage-projects.component.scss']
})
export class ManageProjectsComponent implements OnInit {

  disableField: boolean;
  financialRatioForm: FormGroup;
  currentAction: string = CyncConstants.ADD_OPERATION;
  addEditProject: FormGroup;
  projectId: number;
  currentActionBtnText: string = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT; // default page text for add page ;
  saveAndNewBtnText: string = CyncConstants.ADD_PAGE_SAVE_AND_NEW_BTN_TEXT; // button text for save and new button
  cancelBtnText: string = CyncConstants.ADD_EDIT_PAGE_CANCEL_BTN_TEXT; // button text for cancel button
  IsSaveAndNewBtnRequired: boolean = CyncConstants.SAVE_AND_NEW_BTN_REQUIRED_PROPERTY;
  financialAnalyzerDropDownResult: Observable<any>;
  borrowerId: string;
  clientSelectionSubscription: Subscription;
  naics_code_name: string;
  client_name: string;
  showNewFolder: boolean;
  newFolder: string = '';
  listProjectId: any;
  listProjectFolder: any;
  clientID: any;
  selectedItem: any;
  addOrEdit: string;
  dataTableElementId: string = 'new_project_name';
  selectedValuePeriod:string ='';

  //DropDown Global Variables
  get_balanceSheet_list: SelectDropDown[];
  get_financial_periods: SelectDropDown[];
  get_financial_time_lines: SelectDropDown[];
  get_financial_periods_types:any;
  get_folder_name: SelectDropDown[];

  constructor(private _apiMapper: APIMapper,
    private _helper: Helper,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _fb: FormBuilder,
    private _msgServices: MessageServices,
    // private _udfDefinitionService: UdfDefinitionService,
    private _formValidationService: FormValidationService,
    private listProjectService: ListProjectService,
    private _clientSelectionService: ClientSelectionService) {
    this.borrowerId = CyncConstants.getSelectedClient();
  }

  ngOnInit() {
    this.initFormValidator();
    // this.getDropDownValues();
    this.registerReloadGridOnClientSelection();
    this.getClientDetails();
    // this._renderForm();

    this.getDropDownValues().subscribe(result => {
      this.populateDropDown(result);
      this._renderForm();
   
    })
  }


  /**
  * Render Form with values as per the Add / Edit operation
  */
  _renderForm() {
    /* getting router parameters */
    this._activatedRoute.params.subscribe(params => {
      this.listProjectId = params['id'];
      if (params['id']) {
        this.addOrEdit = "Edit"
      } else {
        this.addOrEdit = "Add"
        let folderName = CyncConstants.getFolderName();
        console.log("folderName",folderName);
        if(folderName.folderName != "NoFolder"){
          this.financialRatioForm.controls['folder'].setValue(folderName);
        }

      }
      if (this.listProjectId !== undefined) {
        this.currentAction = CyncConstants.EDIT_OPERATION;
        this.currentActionBtnText = CyncConstants.EDIT_PAGE_SAVE_BTN_TEXT;
        this.showFAForm();
      } else {
        this.currentAction = CyncConstants.ADD_OPERATION;
      }
    });
  }

  initFormValidator() {
    this.financialRatioForm = this._fb.group({
      projectName: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),
      description: new FormControl(null, Validators.compose([Validators.maxLength(150)])),
      clientName: new FormControl(null, Validators.compose([Validators.required])),
      folderName:new FormControl(),
      clientId: new FormControl(),
      industry: new FormControl(null, Validators.compose([Validators.required])),
     // balanceSheetYear: new FormControl(null, Validators.compose([Validators.required])),
      financialPeriod: new FormControl(null, Validators.compose([Validators.required])),
    //  financialTimeline: new FormControl(null, Validators.compose([Validators.required])),
      folder: new FormControl('', Validators.compose([Validators.required])),
      fromPeriod: new FormControl(),
      yearFrom: new FormControl('', Validators.compose([Validators.required])),
      toPeriod: new FormControl(),
      yearTo: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  compare(val1: any, val2: any) {
    if (val2) {
        return val1.folderName == val2.folderName;
   }
  }


  checkLimit(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value && (isNaN(c.value) || c.value < min || c.value > max)) {
        return { 'range': true };
      }
      return null;
    };
  }

  /**
   * Method to map FA Model Values with FA Form
   */
  showFAForm() {

    this._msgServices.showLoader(true);
    this.listProjectService.getListProjectById(this._apiMapper.endpoints[CyncConstants.LIST_PROJECT_BY_ID].replace('{id}', this.listProjectId)).subscribe(res => {
      if (res.folder == null) {
        res.folder = {
          "id": null,
          "folderName": "Project List"
        }
      }
      this.selectedValuePeriod = res.financialPeriod;
      this.financialRatioForm.patchValue(res);
      this.disableField = true;
      this._msgServices.showLoader(false);
    });

  }

  /**
   * Method to save FA
   * @param model
   * @param isValid
   */
  saveFACode(model: any, isValid: boolean, isNew: boolean) {

    if (isValid) {
      if (this.isCurrentActionAdd()) {
        this.disableField = false;
        this.createFACode(model, isNew);
      } else {
        this.updateFA(model)
      }

    }
  }


  /**
 * Method to Create New FA Code
 * @param requestBody
 * @param isNew
 */
createFACode(model: any, isNew: boolean) {
  
  //debugger;
    let newModel = JSON.parse(JSON.stringify(model));
    this._msgServices.showLoader(true);
    if (newModel.folder.folderName == 'Create New Folder') {
    //  console.log("this.financialRatioForm.controls['folderName'].value",this.financialRatioForm.controls['folderName'].value);
      newModel.folder.folderName =  this.financialRatioForm.controls['folderName'].value;
    }
    if (newModel.folder.folderName == 'Project List') {
      newModel.folder = null;
    }
    let message: string = 'New Project saved successfully,';
    //Only in case of save and new we need to show the loader because in other case the getdata method has loader
    this._msgServices.showLoader(true);
    this.listProjectService.saveListProject(this._apiMapper.endpoints[CyncConstants.DELETE_LIST_PROJECT_BY_ID], newModel).subscribe(res => {
      this._helper.showApiMessages(message, 'success');
      this._msgServices.showLoader(false);
      if (!isNew) {
        this.navigateToFAList();
      } else {
       // this.populateDropDown();
       
    this.getDropDownValues().subscribe(result => {
      this.populateDropDown(result);
      this._renderForm();
   
    });

        this.financialRatioForm.reset();
        this.financialRatioForm.controls['folderName'].setValue('');
        this.financialRatioForm.controls['folder'].setValue('');
        this.financialRatioForm.controls['clientName'].setValue(this.client_name);
        this.financialRatioForm.controls['industry'].setValue(this.naics_code_name);
        this.financialRatioForm.controls['clientId'].setValue(this.clientID);
        this.selectedValuePeriod = '';
        this.showNewFolder = false;
      }
    });
  }

  updateFA(model: any) {

    let newModel =  JSON.parse(JSON.stringify(model));;

    this._msgServices.showLoader(true);
    if (newModel.folder.folderName == 'Create New Folder') {
      newModel.folder.folderName = this.financialRatioForm.controls['folderName'].value;
    }

    if (newModel.folder.folderName == 'Project List') {
      newModel.folder = null;
    }
    newModel.id = this.listProjectId;
    this.listProjectService.updateListProjectFA(this._apiMapper.endpoints[CyncConstants.LIST_PROJECT_BY_ID].replace('{id}', this.listProjectId), newModel).subscribe(res => {
      let message: string = 'Project Updated successfully';
      this._helper.showApiMessages(message, 'success');

      this._msgServices.showLoader(false);
     this.navigateToFAList();
    });

  }


  /**
  * This Method is used to check if the current action is add
  */
  isCurrentActionAdd(): boolean {
    return this._helper.isCurrentActionAdd(this.currentAction);
  }

  /**
   * This method is taken care when user will change the client or borrowers
   */
  registerReloadGridOnClientSelection() {
    const currObj = this;
    this.clientSelectionSubscription = this._clientSelectionService.clientSelected.subscribe(clientId => {
      if (typeof this.borrowerId === 'string' && this._helper.compareIgnoreCase(this.borrowerId, CyncConstants.SELECT_CLIENT_PLACEHOLDER)) {
        setTimeout(function () {
          window.location.href = '../../';
        }, 2000);
      }else{
        this.navigateToFAList();
      }
    });
  }

  getClientDetails() {
    this._msgServices.showLoader(true);
    const url = this._apiMapper.endpoints[CyncConstants.GET_BORROWER_BY_ID].replace('{borrower_id}', this.borrowerId);
    this.listProjectService.getBorrowerDetails(url).subscribe(data => {
      if (data !== undefined && data.borrower !== undefined
        && data.borrower.client_name !== undefined && data.borrower.client_name !== null) {
        this.financialRatioForm.controls['clientName'].setValue(data.borrower.client_name);
        this.financialRatioForm.controls['industry'].setValue(data.borrower.naics_code_name);
        this.financialRatioForm.controls['clientId'].setValue(this.borrowerId);
        this.clientID = this.borrowerId;
        this.client_name = data.borrower.client_name;
        this.naics_code_name = data.borrower.naics_code_name;
      }
      this._msgServices.showLoader(false);
    });
  }


   /**
   * Method to hightlight mandatory fileds if form validations fail
   * @param field 
   */
  displayCssField(field: string) {
    return this._helper.getFieldCss(field, this.financialRatioForm);
}

  /**
 * Get Drop down values using APIs
 */
  getDropDownValues(): Observable<any[]> {
    let clientId = CyncConstants.getSelectedClient();
    let res1 = this.listProjectService.getDropDownValues(this._apiMapper.endpoints[CyncConstants.GET_BALANCESHEET_LIST], 'get_balanceSheet_list');
    let res2 = this.listProjectService.getDropDownValues(this._apiMapper.endpoints[CyncConstants.GET_FINANCIAL_PERIOD], 'get_financial_periods');
    let res3 = this.listProjectService.getDropDownValues(this._apiMapper.endpoints[CyncConstants.GET_FINANCIAL_TIME_LINES], 'get_financial_time_lines');
    let res4 = this.listProjectService.getDropDownValues(this._apiMapper.endpoints[CyncConstants.GET_FINANCIAL_PERIOD_TYPES], 'get_financial_periods_types');
    let res5 = this.listProjectService.getDropDownValues(this._apiMapper.endpoints[CyncConstants.FOLDER_LIST_PROJECT].replace('{clientId}',clientId), 'get_folder_name');
   
    return forkJoin([res1, res2, res3, res4, res5]);
  }

  /**
   * This method will populate all teh dropdown fields from the data recieved from service
   * @param result
   */
  get_halfyearly_data:SelectDropDown[];
  get_quaterly_data:SelectDropDown[];
  get_monthly_data:SelectDropDown[];

  populateDropDown(result: any) {
    // Pass url for Nat Sign Drop Down
    this.get_balanceSheet_list = this.mapDropDownToSelectDropDown(result[0]);

    // Pass url for period Drop Down
    this.get_financial_periods = result[1];
    this.get_financial_periods = this.mapDropDownToSelectDropDown(result[1]);

    // Pass url for FA timeline Drop Down
    this.get_financial_time_lines = result[2];
    this.get_financial_time_lines = this.mapDropDownToSelectDropDown(result[2]);

    // Pass url for FA timeline Drop Down
    this.get_financial_periods_types = result[3];
    this.get_halfyearly_data =this.get_financial_periods_types.half_yearly;
    this.get_quaterly_data =this.get_financial_periods_types.quarterly;
    this.get_monthly_data =this.get_financial_periods_types.monthly;
    //this.get_financial_periods_types = this.mapDropDownToSelectDropDown(result[3]);


    // Pass url for folderName Drop Down
    this.get_folder_name = result[4];
    // this.get_folder_name = this.mapDropDownToSelectDropDown1(result[3]);


  }

  /**
   * This method is used to map the dropdown Datatype list
   * to SelectDropDown Datatype list
   * @param dropDownsList
   */
  mapDropDownToSelectDropDown(dropDownsList: Dropdown[]): SelectDropDown[] {
    if (dropDownsList !== null && dropDownsList !== undefined) {
      return dropDownsList.filter(d => (d.show === undefined || d.show)).map(d => new SelectDropDown(d.value, d.display));
    }
    return [];
  }

  at:any;
  
  fnFinancialPeriodChange(val : any){
     this.financialRatioForm.controls['fromPeriod'].setValue(null);
    this.financialRatioForm.controls['yearFrom'].setValue(null);
     this.financialRatioForm.controls['toPeriod'].setValue(null);
     this.financialRatioForm.controls['yearTo'].setValue(null);

  

    if(val == 'HALF_YEARLY' || val == 'QUARTERLY' || val == 'MONTHLY'){
      this.financialRatioForm.get('fromPeriod').setValidators([Validators.required]);
      this.financialRatioForm.get('toPeriod').setValidators([Validators.required]);
    }
    if(val == 'YEARLY'){
      this.financialRatioForm.controls['fromPeriod'].setValidators([]);
      this.financialRatioForm.controls['toPeriod'].setValidators([]);
      this.financialRatioForm.controls['fromPeriod'].updateValueAndValidity();
      this.financialRatioForm.controls['toPeriod'].updateValueAndValidity();

    }
    this.selectedValuePeriod=val;
}



  // mapDropDownToSelectDropDown1(dropDownsList: Dropdown1[]): SelectDropDown[] {
  //   if (dropDownsList !== null && dropDownsList !== undefined) {
  //     return dropDownsList.filter(d => (d.show === undefined || d.show)).map(d => new SelectDropDown(d.id, d.folderName));
  //   }
  //   return [];
  // }

  fnChange(modelValue) {
    if (modelValue.folderName == 'Create New Folder') {
      this.financialRatioForm.get('folderName').setValidators([Validators.required,Validators.minLength(3),Validators.maxLength(50)]);
      this.showNewFolder = true;
    } else {
      this.financialRatioForm.controls['folderName'].setValidators([]);
      this.financialRatioForm.controls['folderName'].updateValueAndValidity();
      this.showNewFolder = false;
    }
  }

  /**
   * Get Form Control field
   * @param field
   */
  getFormControl(field: string) {
    return this.financialRatioForm.get(field);
  }

  /**
   * If user has not done any changes to form , this method is to check same and disable action btn save/update
   */
  isFormValid(): boolean {
    if (this.isCurrentActionAdd() && CyncConstants.ADD_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
      return !this.financialRatioForm.valid;
    }

    if (CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
      // we have to disable form btn
      return !this.financialRatioForm.valid || this.financialRatioForm.pristine
    } else {
      // we dont have to disable btn
      return false;
    }
  }

  /**
   * Method to navigate back to FA list
   */
  navigateToFAList() {
    this._router.navigateByUrl(MenuPaths.LIST_FINANCE_ANALYZER_PATH);
  }

  /**
	 * unsubscribe the observable for client change
	 */
  ngOnDestroy() {
    if(this.clientSelectionSubscription!==undefined)
      this.clientSelectionSubscription.unsubscribe();
  }

}