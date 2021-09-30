import { Component, OnInit, OnDestroy, ViewChild, AfterContentInit } from '@angular/core';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { FinancialRatioService } from '../service/financial-ratio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { Subscription } from 'rxjs/Subscription';
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';
import { ListProjectService } from '../../financial-analyzer/service/list-project.service';
import { Observable } from 'rxjs/Observable';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import { Helper } from '@cyncCommon/utils/helper';
import { FormGroup, Validators, FormControl, ValidatorFn, FormControlName, FormBuilder } from '@angular/forms';
import { customRatio, ratioCategories } from './model/custom-ratio.model';
import { CustomRatiosService } from './service/custom-ratios.service';
import { ListFormulaComponent } from './list-formula/list-formula.component';
import { FormValidationService } from '@cyncCommon/cync-form-validator/form-validation.service';

@Component({
  selector: 'app-custom-ratios',
  templateUrl: './custom-ratios.component.html',
  styleUrls: ['./custom-ratios.component.scss']
})

export class CustomRatiosComponent implements OnInit, OnDestroy, AfterContentInit {

  @ViewChild(ListFormulaComponent) formularList: ListFormulaComponent;

  availableParameters: string[] = [];
  customRatioForm: FormGroup;
  projectID: string = this.getProjectID();
  projectName: string = '';
  selectedRadioBtn: string = 'financial_ratio';
  assetsPath: string = CyncConstants.getAssetsPath();
  client_name: string;
  borrowerId: string;
  dynamicColumn: number = 0;
  clientSelectionSubscription: Subscription;
  disableField: boolean;
  showCancelBtn: boolean = false;
  currentAction: string = '';
  editOperation: string = CyncConstants.EDIT_OPERATION;
  currentActionBtnText: string = CyncConstants.ADD_PAGE_SAVE_BTN_TEXT; // default page text for add page ;
  cancelBtnText: string = CyncConstants.ADD_EDIT_PAGE_CANCEL_BTN_TEXT; // button text for cancel button
  clientID: any;
  //show loader on scroll event
  showSpinner: boolean;
  ratioCategories: ratioCategories[];
  customRatioModel: customRatio[];
  isValidFormula: boolean = false;

  //For editing purpose
  selectedRatioId: string = null;

  constructor(
    private _messageService: MessageServices,
    private _clientSelectionService: ClientSelectionService,
    private _ratioService: FinancialRatioService,
    private _projectService: ListProjectService,
    private _apiMapper: APIMapper,
    private route: ActivatedRoute,
    private _router: Router,
    private _helper: Helper,
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _radioButtonVisible: RadioButtonService,
    private _customRatioService: CustomRatiosService,
    private _formValidationService: FormValidationService
  ) {
    this.borrowerId = CyncConstants.getSelectedClient();
  }

  ngOnInit() {
    this._radioButtonVisible.setRadioButton(true, this.projectID, this.selectedRadioBtn);
    this.getProjectNameByID(this.getProjectID());
    this._messageService.showLoader(true);
    this.getClientDetails();
    this.registerReloadGridOnClientSelection();
    this.createForm();
    this.getCategories();
    this.getParameters();
  }

  ngAfterContentInit() {
    this.formularList.getCurrentAction().subscribe(message => {
      this.currentAction = message.currentAction;
      if (message.currentAction == CyncConstants.GET_ADD_ACTION) {
        this.customRatioForm.reset();
      }
      else if (message.currentAction == CyncConstants.GET_EDIT_ACTION) {
        this.selectedRatioId = message.selectedID;
        this.patchRatioForm(this.selectedRatioId);


        //Edit ACtion Need to work on this.

      }
    })
  }


  /**
   * Method to Get Project Name based on Project ID
   * @param projectID
   * 
   */
  getProjectNameByID(projectID) {
    let url = this._apiMapper.endpoints[CyncConstants.LIST_PROJECT_BY_ID].replace('{id}', projectID);
    this._projectService.getListProjectById(url).subscribe(res => {
      this.projectName = res.projectName;
    });

  }

  /**
  * This method will get the ProjectID From URL
  */
  getProjectID(): string {
    let projID = '';
    this.route.params.subscribe(params => {
      projID = params['id'];
      this.projectID = params['id'];
    });
    return projID;
  }

  getClientDetails() {
    this._messageService.showLoader(true);
    const url = this._apiMapper.endpoints[CyncConstants.GET_BORROWER_BY_ID].replace('{borrower_id}', this.borrowerId);
    this.getBorrowerDetails(url).subscribe(data => {
      if (data !== undefined && data.borrower !== undefined
        && data.borrower.client_name !== undefined && data.borrower.client_name !== null) {
        this.client_name = data.borrower.client_name;
      }
      this._messageService.showLoader(false);
    });
  }

  /**
    * This method is taken care when user will change the client or borrowers
    */
  registerReloadGridOnClientSelection() {
    const currObj = this;
    this.clientSelectionSubscription = this._clientSelectionService.clientSelected.subscribe(clientId => {
      if (typeof clientId === 'string' && this._helper.compareIgnoreCase(clientId, CyncConstants.SELECT_CLIENT_PLACEHOLDER)) {
        setTimeout(function () {
          window.location.href = '../../';
        }, 2000);
      } else {
        this.navigateToFAList();
      }
    });
  }

  /**
  * get the active client
  */
  public getBorrowerDetails(url: string): Observable<any> {
    return this._ratioService.getBorrowerDetails(url);
    // return this._cyncHttpService.get(url).map(data => JSON.parse(data._body));
  }

  /**
 * unsubscribe the observable for client change
 */
  ngOnDestroy() {
    if (this.clientSelectionSubscription !== undefined)
      this.clientSelectionSubscription.unsubscribe();
  }

  /**
   * Method to navigate back to FA list
   */
  navigateToFAList() {
    this._router.navigateByUrl(MenuPaths.LIST_FINANCE_ANALYZER_PATH);
  }

  /**
  * If user has not done any changes to form , this method is to check same and disable action btn save/update
  */
  isFormValid(): boolean {
    if (this.isCurrentActionAdd() && CyncConstants.ADD_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
      return !this.customRatioForm.valid;
    }

    if (CyncConstants.EDIT_PAGE_SAVE_BTN_DISABLE_PROPERTY) {
      // we have to disable form btn
      return !this.customRatioForm.valid || this.customRatioForm.pristine
    } else {
      // we dont have to disable btn
      return false;
    }
  }

  backToSetup() {
    this._router.navigate(['/financial/financial-ratio/' + this.projectID]);
  }


  /**
  * This Method is used to check if the current action is add
  */
  isCurrentActionAdd(): boolean {
    return this._helper.isCurrentActionAdd(this.currentAction);
  }
  /**
   * This Method is used to check if the current action is add
   */
  isCurrentActionEdit(): boolean {
    return this._helper.isCurrentActionEdit(this.currentAction);
  }


  /**
 * Create Custom Ratio Form Group
 */
  createForm() {
    this.customRatioForm = this._fb.group({
      id: new FormControl(),
      ratio: new FormControl(null, Validators.compose([Validators.required])),
      formulaName: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50),this._formValidationService.validateNameWithSpecialCharacter])),
      expression: new FormControl(null, Validators.required)
    });
  }

  /**
  * Method to hightlight mandatory fileds if form validations fail
  * @param field 
  */
  displayCssField(field: string) {
    return this._helper.getFieldCss(field, this.customRatioForm);
  }

  /**
   * This method will 
   */
  compare(val1: any, val2: any) {
    if (val2) {
      return val1.name == val2.name;
    }
  }

  /**
   * Get Form Control field
   * @param field
   */
  getFormControl(field: string) {
    return this.customRatioForm.get(field);
  }

  /**
  * This method will create new ratio under the selected category
  */
  public createCustomFormula(model: customRatio, formisValid: boolean, isNew: boolean, ): void {
    let requestBody = new customRatio();
    requestBody = model;
    requestBody.clientId = this.borrowerId;
   
   // requestBody.expression = this.convertExpression(this.getFormControl('expression').value);
   // requestBody.variables = this.convertVariables(this.getVariables(this.getFormControl('expression').value));
   requestBody.expression = this.replaceParamtoUniqueId(this.getFormControl('expression').value);
    let api_url = '';
    //if (formisValid && this.isValidFormula) {
    if (formisValid) {


      // Save it if this is  a new formula
      if (this.isCurrentActionAdd()) {
        api_url = this._apiMapper.endpoints[CyncConstants.CUSTOM_FINANCIAL_RATIO_CREATE].replace('{clientId}', this.borrowerId);
        let message: string = 'New ratio has been created successfully.';
        this._messageService.showLoader(true);
        this._customRatioService.post(api_url, requestBody).subscribe(res => {
          if (res.status == CyncConstants.STATUS_201) {
            this._helper.showApiMessages(message, 'success');
            this.customRatioForm.reset();
            this.formularList.loadGridData();
            this._messageService.showLoader(false);
            this.currentAction = CyncConstants.GET_ADD_ACTION;
          }
        });

      }

      //for Editing Custom Formulas
      else if (this.isCurrentActionEdit()) {

        api_url = this._apiMapper.endpoints[CyncConstants.CUSTOM_FINANCIAL_RATIO_UPDATE].replace('{clientId}', this.borrowerId).replace('{customFormulaId}', this.selectedRatioId);
        let message: string = 'Ratio has been updated successfully.';
        this._messageService.showLoader(true);
        this._customRatioService.update(api_url, requestBody).subscribe(res => {
          if (res.status == CyncConstants.STATUS_204) {
           
            this._helper.showApiMessages(message, 'success');
            this.customRatioForm.reset();
            this.formularList.loadGridData();
            this.customRatioForm.reset();
            this._messageService.showLoader(false);
            this.currentAction = CyncConstants.GET_ADD_ACTION;
          }
          else {
            this._messageService.showLoader(false);
            this._helper.showApiMessages(CyncConstants.ERROR_IN_PROCESSING_REUEST, 'warning');
          }
        });

      }

    }
  }

  /**
   * This method will call the service and get the list of Ratio categories
   * @used for generating the dropdown
   */
  getCategories() {
    this._customRatioService.getCategories(this._apiMapper.endpoints[CyncConstants.RATIOS_LIST_CATEGORIES]).subscribe(res => {
      this.ratioCategories = res;
    });
  }

  /**
 * This method will call the service and get the list of Ratio categories
 * @used for generating the dropdown
 */
  getParameters() {
    this._customRatioService.getParameters(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENT_LIST_PARAMETERS].replace('{clientId}', this.borrowerId)).subscribe(res => {
      this.availableParameters = res;
    });
  }

  /**
   * 
   * @param str Generate Variable list from the given striing
   * @description Required for API, this method will split the letters with in each brackets and assign to one array which the API will accept.
   */
  getVariables(expression) {
    let variableList: any = [];
    try {
      let splitExp = expression.match(/\[(.*?)\]/g);
      for (var i = 0; i < splitExp.length; i++) {
        variableList.push(splitExp[i].replace('[', '').replace(']', ''));
      }
      this.isValidFormula = true;
      return variableList;

    } catch (err) {

      this.isValidFormula = false;
      this._helper.showApiMessages('Invalid formula, Please review all fields referenced by the formula', 'danger');

    }

  }

  /**
   * This method will convert the expression string with the unique ID of each parameters
   */
  convertExpression(expression: string): string {
    //Need to work on this
    return expression.replace(/\[(.*?)\]/g, (x) => {
      return this.getUniqueIdByName(x);
    });
  }

  /**
 * This method will convert the variable list with unique IDs
 */
  convertVariables(variableList): any {
    //Need to work on this
    let uniqueIdList = [];
    for (let i of variableList) {
      uniqueIdList.push(this.getUniqueIdByName(i));
    }
    return uniqueIdList;
  }

  /**
   * This method to get the unique ID for given parameter
   */
  getUniqueIdByName(parameter) {
    let findme = parameter.replace('[', '').replace(']', '')
    let data = this.availableParameters;
    for (const key of Object.keys(data)) {
      if (data[key].name === findme) {
        return data[key].uniqueId;
      }
    }
    return '';
  }

  /**
   * This method will replace the uniqueIds to parameter name
   */
  replaceUniquIdtoParam(expression) {
     
    let data = this.availableParameters;
    for (const key of Object.keys(data)) {
      //expression = expression.replace(data[key].uniqueId, "[" + data[key].name + "]")      
      expression = expression.replace(data[key].uniqueId, data[key].name)
    }
    return expression;
  }

  /**
   * Get the values for the selected Ratio and Patch it to the form
   * @param selectedID
   */
  patchRatioForm(selectedID) {
    this._messageService.showLoader(true);
    const api_url = this._apiMapper.endpoints[CyncConstants.GET_CUSTOM_FINANCIAL_RATIOS_BY_ID].replace('{clientId}', this.borrowerId).replace('{customFormulaId}', selectedID);
    this._customRatioService.getCustomFormulas(api_url).subscribe(res => {
    this.customRatioModel = res;
    this.customRatioForm.patchValue(this.customRatioModel)
     // this.getFormControl('ratio').patchValue(res.ratio);
     // this.getFormControl('formulaName').patchValue(res.formulaName);
     this.getFormControl('expression').patchValue(res.display);
      this._messageService.showLoader(false);
    });
  }

  /**
   * cancel Edit Action
   */
  cancelEdit() {
    this._messageService.showLoader(true);
    this.customRatioForm.reset();
    //this.formularList.dataTableElementId.
    this.currentAction = CyncConstants.GET_ADD_ACTION;
    this.formularList.selectedRows = [];
    this.formularList.updateGridIcons();
    this._messageService.showLoader(false);
  }

  /**
   * Method to replace expression with uniqueID
   * @param expression
   */
  replaceParamtoUniqueId(expression)
  {
    let data = this.availableParameters;
    for (const key of Object.keys(data)) {
      expression = expression.split(data[key].name).join(data[key].uniqueId);      
    }
    return expression;
  }

}
