import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { FormValidationService } from '@cyncCommon/cync-form-validator/form-validation.service';
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';
import { FinancialStatementsService } from '../services/financial-statements.service';
import { FinancialStatementModel, IncomeStatementModel } from '../models/financial-statements.model';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { Subscription } from 'rxjs/Subscription';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';

@Component({
	selector: 'app-financial-statements-setup-income-statement',
	templateUrl: './financial-statements-setup-income-statement.component.html',
	styleUrls: ['./financial-statements-setup-income-statement.component.scss']
})
export class FinancialStatementsSetupIncomeStatementComponent implements OnInit, OnDestroy, DoCheck {

	currentAction: string = CyncConstants.ADD_OPERATION;
	currentActionBtnText: string = CyncConstants.SAVE_AND_GO_TO_NEXT_BTN_TEXT; // default show next page label;
	backBtnText: string = CyncConstants.ADD_EDIT_PAGE_BACK_BTN_TEXT; // button text for cancel button
	financialStatementForm: FormGroup;
	financialStatementAPIResponse: any;
	isFormLoaded = false;
	headerText = CyncConstants.HEADER_TEXT;
	projectID = CyncConstants.getprojetID();
	selectedRadioBtn = 'finanical_statements';
	enableFinanceStatementComplete = false;
	enableFinanceRatioComplete = false;
	previousURL: any;
	projectName = '';
	clientSelectionSubscription: Subscription;
	finStatementDataTableHeight: any;
	dropdownMenu: boolean;
	isFullScreen = false;

	// Adding more rows fields
	deletedCustomParameters: Array<any> = [];
	dropdownMenuOpProfitParams: boolean;
	dropdownMenuProfitBeforeTaxParams: boolean;
	dropdownMenuCompIncomeParams: boolean;

	constructor(private _helper: Helper,
		private _router: Router,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private _message: MessageServices,
		private _apiMapper: APIMapper,
		private _financialStatementsService: FinancialStatementsService,
		private _commonApiHelper: CommonAPIs,
		private _clientSelectionService: ClientSelectionService,
		private _radioButtonVisible: RadioButtonService
	) {

		// Fetching previous url value
		this._router.events
			.filter(e => e instanceof RoutesRecognized)
			.pairwise()
			.subscribe((event: any[]) => {
				CyncConstants.setPreviousURL(event[0].urlAfterRedirects);
			});
	}

	ngOnInit() {
		this._message.showLoader(true);
		this.previousURL = CyncConstants.getPreviousURL();
		this.createForm();
		this.initializeFinancialStatemets();
		this.registerReloadGridOnClientSelection();
		this._radioButtonVisible.setRadioButton(this.enableFinanceStatementComplete, this.projectID, this.selectedRadioBtn);

	}

	/**
	* Expand to full sceren
	*/
	fnExpand() {
		this.isFullScreen = !this.isFullScreen;
	}

	/**
	* Income statement dropdown value selection
	*/
	addNewCustomFieldClick(value) {
		if (value === 'opProfitParams') {
			this.dropdownMenuOpProfitParams = !this.dropdownMenuOpProfitParams;
		} else if (value === 'profitBeforeTaxParams') {
			this.dropdownMenuProfitBeforeTaxParams = !this.dropdownMenuProfitBeforeTaxParams;
		} else if (value === 'compIncomeParams') {
			this.dropdownMenuCompIncomeParams = !this.dropdownMenuCompIncomeParams;
		}
	}

	/**
	* Add new Custom Field
	*/
	addCustomField(parentControl: string, selectedValue: any) {
		const selectedDropDownOption = (selectedValue === 'Income') ? 'INCOME' : 'EXPENSE';
		let formDataControl;
		formDataControl = (<FormArray>(<FormGroup>this.financialStatementForm.controls.incomeStatementData).controls[parentControl]);
		const addParamsCtrl = this.initializeParameterData();
		addParamsCtrl.controls.newcustomfield.setValue(true);
		addParamsCtrl.controls.customParameter.setValue(true);
		addParamsCtrl.controls.incomeParamType.setValue(selectedDropDownOption);
		for (let i = 0; i < this.financialStatementAPIResponse.timeLinesList.length; i++) {
			const dataControl = <FormArray>(addParamsCtrl.controls.data);
			const dataFormControl = this.initilizeData();
			dataFormControl.controls.timeLine.setValue(this.financialStatementAPIResponse.timeLinesList[i]);
			dataFormControl.controls.value.setValue(0);
			dataControl.push(dataFormControl);
		}
		// formDataControl.push(addParamsCtrl);	 // Add custom field end of form
		formDataControl.insert(0, addParamsCtrl); // Add custom field in first position

		// Hide drop down list
		if (parentControl === 'opProfitParams') {
			this.dropdownMenuOpProfitParams = !this.dropdownMenuOpProfitParams;
		} else if (parentControl === 'profitBeforeTaxParams') {
			this.dropdownMenuProfitBeforeTaxParams = !this.dropdownMenuProfitBeforeTaxParams;
		} else if (parentControl === 'compIncomeParams') {
			this.dropdownMenuCompIncomeParams = !this.dropdownMenuCompIncomeParams;
		}
	}

	/**
	* Delete Custom Field
	*/
	deleteCustomField(index: number, parentControl: string, paramsFormArray: FormGroup) {
		this._message.showLoader(true);
		this.updateDeletedCustomFieldTotalValue(paramsFormArray.value, parentControl);
		const isNewCustomField = paramsFormArray.get('newcustomfield').value;
		(<FormArray>(<FormGroup>this.financialStatementForm.controls.incomeStatementData).controls[parentControl]).removeAt(index);

		// Deleting existing custom field
		if (!isNewCustomField) {
			const customParamID = paramsFormArray.get('id').value;
			this.deletedCustomParameters.push(customParamID);
		}
		// this.draftFinanceStatement();
		this._message.showLoader(false);
	}

	/**
	* Update Custom Field Parameter Value while focus out.
	*/
	updateCustomParamValue(indexValue: string, paramValue: string, paramsFormArray: FormGroup) {
		const customParamValue = paramValue.trim();
		if (customParamValue !== null && customParamValue !== undefined && customParamValue !== '') {
			const model = this.financialStatementForm.getRawValue();
			this.duplicateParamsValidation(model, customParamValue);
		} else {
			this.financialStatementForm.setErrors({ 'invalid': true });
		}
	}

	/**
	* Duplicate key validation
	*/
	duplicateParamsValidation(model: FinancialStatementModel, keyName: string) {

		let duplicateCount = 0;
		const keyNameLowerCase = keyName.toLowerCase();
		const paramaterArray = ['opProfitParams', 'profitBeforeTaxParams', 'compIncomeParams', 'grossProfitParams', 'incomeLossContParams'];
		for (let i = 0; i < paramaterArray.length; i++) {
			for (let j = 0; j < model.incomeStatementData[paramaterArray[i]].length; j++) {
				if ((model.incomeStatementData[paramaterArray[i]][j].parameter.trim()).toLowerCase() === keyNameLowerCase) {
					duplicateCount++;
				}
			}
		}

		if (duplicateCount > 1) {
			this._helper.openAlertPoup('warning_msg', 'Duplicate key exists: ' + keyName);
			this.financialStatementForm.setErrors({ 'invalid': true });
		}
	}

	/**
	* Ng do check
	*/
	ngDoCheck() {
		this.resizetheTable();
	}

	/**
	* Initial Form creation
	*/
	createForm() {
		this.financialStatementForm = this.fb.group({
			'id': new FormControl(),
			'projectId': new FormControl(),
			'timeLinesList': new FormControl(),
			'balanceSheetData': new FormControl(),
			'incomeStatementData': this.fb.group({
				'grossProfitParams': this.fb.array([]),
				'grossProfit': this.fb.array([]),
				'opProfitParams': this.fb.array([]),
				'opProfit': this.fb.array([]),
				'profitBeforeTaxParams': this.fb.array([]),
				'profitBeforeTax': this.fb.array([]),
				'incomeLossContParams': this.fb.array([]),
				'incomeLossCont': this.fb.array([]),
				'compIncomeParams': this.fb.array([]),
				'compIncomeLoss': this.fb.array([]),
				'totalIncome': this.fb.array([])
			}),
			'cashFlowData': new FormControl(),
			'deletedCustomParameters': new FormControl(),
			'validateFinStmt': new FormControl({ value: false }, Validators.compose([]))
		});
	}

	/**
	 * Initialize Income statement parameter data
	 */
	initializeParameterData() {
		return this.fb.group({
			'parameter': new FormControl('', Validators.compose([Validators.required])),
			'data': this.fb.array([]),
			'incomeParamType': new FormControl(),
			'customParameter': new FormControl(),
			'id': new FormControl(),
			'newcustomfield': new FormControl({ value: false, disabled: true }, Validators.compose([])),
			'uniqueId': new FormControl()
		});
	}

	/*
	* Initialized data
	*/
	initilizeData() {
		return this.fb.group({
			'timeLine': new FormControl(),
			'value': new FormControl()
		});
	}

	/**
	* Patch Parameter data
	*/
	patchParameterData(parameterFormArray: FormArray, parameterDataList: any[]) {
		for (let i = 0; i < parameterDataList.length; i++) {
			const parameterData = parameterDataList[i];
			const parameterFormGroup = this.initializeParameterData();
			parameterFormGroup.patchValue(parameterData);
			this.patchData(<FormArray>parameterFormGroup.controls['data'], parameterData['data']);
			parameterFormArray.push(parameterFormGroup);
		}
	}

	/**
	* Patch Data
	*/
	patchData(dataFormArray: FormArray, dataList: any) {
		for (let j = 0; j < dataList.length; j++) {
			const data = dataList[j];
			const dataGroup = this.initilizeData();
			dataGroup.patchValue(data);
			dataFormArray.push(dataGroup);
		}
	}

	/**
	* This method is use to get project details
	* @param projectID
	*/
	getProjectDetails(projectID) {
		this._financialStatementsService.getProjectDetails(this._apiMapper.endpoints[CyncConstants.GET_PROJECT_DETAILS]
			.replace('{projectId}', projectID)).subscribe(res => {
				this.projectName = res.projectName;
			});
	}


	/*
	* Initialize Financial Statement parameter and data
	*/
	initializeFinancialStatemets() {

		// Getting project-ID from route URL
		this.route.params.subscribe(params => {
			this.projectID = params['id'];
			this._commonApiHelper.getServiceProjectStatus(this.projectID).subscribe(financeProjectStatus => {
				this.enableFinanceStatementComplete = financeProjectStatus.financeStatementComplete;
				this.enableFinanceRatioComplete = financeProjectStatus.financeRatioComplete;
			});
		});
		this.getProjectDetails(this.projectID);

		/*
		* Calling API to initialize form data
		*/
		this._financialStatementsService.getFinancialStatements(
			this._apiMapper.endpoints[CyncConstants.GET_FINANCIAL_STATEMENT_PROJECT_DATA]
				.replace('{projectId}', this.projectID)).subscribe(res => {

					this.financialStatementAPIResponse = res;
					this.financialStatementForm.patchValue(res);
					if (res !== undefined && res.incomeStatementData !== undefined) {

						const incomeFormGroup: FormGroup = <FormGroup>this.financialStatementForm.controls.incomeStatementData;
						// Gross Profit Patch
						this.patchParameterData(<FormArray>incomeFormGroup.controls.grossProfitParams, res.incomeStatementData.grossProfitParams);
						this.patchData(<FormArray>incomeFormGroup.controls.grossProfit, res.incomeStatementData.grossProfit);

						// Operating Profit (Loss) or [EBIT] Patch
						this.patchParameterData(<FormArray>incomeFormGroup.controls.opProfitParams, res.incomeStatementData.opProfitParams);
						this.patchData(<FormArray>incomeFormGroup.controls.opProfit, res.incomeStatementData.opProfit);

						// Profit (Loss) before Tax [EBT] Patch
						this.patchParameterData(<FormArray>incomeFormGroup.controls.profitBeforeTaxParams, res.incomeStatementData.profitBeforeTaxParams);
						this.patchData(<FormArray>incomeFormGroup.controls.profitBeforeTax, res.incomeStatementData.profitBeforeTax);

						// Income (Loss) from continuing operations Patch
						this.patchParameterData(<FormArray>incomeFormGroup.controls.incomeLossContParams, res.incomeStatementData.incomeLossContParams);
						this.patchData(<FormArray>incomeFormGroup.controls.incomeLossCont, res.incomeStatementData.incomeLossCont);

						// Comprehensive income (loss) Patch
						this.patchParameterData(<FormArray>incomeFormGroup.controls.compIncomeParams, res.incomeStatementData.compIncomeParams);
						this.patchData(<FormArray>incomeFormGroup.controls.compIncomeLoss, res.incomeStatementData.compIncomeLoss);

						// Total Income
						this.patchData(<FormArray>incomeFormGroup.controls.totalIncome, res.incomeStatementData.totalIncome);
					}

					this.isFormLoaded = true;
					this._message.showLoader(false);
				});
	}
	/**
	  * Get parameter data controls
	  */
	getParameterDataFormArray(arrayName: string) {
		return (<FormArray>this.financialStatementForm.get('incomeStatementData').get(arrayName)).controls;
	}

	/**
	  * Get data controls
	  */
	getDataControls(dataForm: FormGroup) {
		return (<FormArray>dataForm.controls.data).controls;
	}

	/**
	* Save Income Statement Data
	*/
	saveIncomeStatement(model: FinancialStatementModel) {
		this._message.showLoader(true);
		this.deleteExtraCustomField(model, 'newcustomfield');
		model.financeStatementType = 'INCOME_STATEMENT';
		model.deletedCustomParameters = this.deletedCustomParameters;
		let requestBody = new FinancialStatementModel();
		requestBody = model;

		if (this.financialStatementAPIResponse.id !== null) {
			this._financialStatementsService.updateFinancialStatements(
				this._apiMapper.endpoints[CyncConstants.UPDATE_FINANCIAL_STATEMENT_PROJECT_DATA]
					.replace('{projectId}', this.projectID), requestBody).subscribe(responseData => {
						this._helper.showApiMessages(CyncConstants.FINANCIAL_STATEMENT_INCOME_STMT_UPDATE_SUCCESS_MSG, CyncConstants.SUCCESS_CSS);
						this.deletedCustomParameters = [];
						this.redirectMethod();
					});
		} else {
			this._financialStatementsService.saveFinancialStatements(
				this._apiMapper.endpoints[CyncConstants.SAVE_FINANCIAL_STATEMENT_PROJECT_DATA], requestBody).subscribe(responseData => {
					this._helper.showApiMessages(CyncConstants.FINANCIAL_STATEMENT_INCOME_STMT_SAVE_SUCCESS_MSG, CyncConstants.SUCCESS_CSS);
					this.deletedCustomParameters = [];
					this.redirectMethod();
				});
		}
	}

	/**
	* Delete Extra field according to key name.
	*/
	deleteExtraCustomField(model: FinancialStatementModel, keyName: string) {

		const paramaterArray = ['opProfitParams', 'profitBeforeTaxParams', 'compIncomeParams', 'grossProfitParams', 'incomeLossContParams'];
		for (let i = 0; i < paramaterArray.length; i++) {
			for (let j = 0; j < model.incomeStatementData[paramaterArray[i]].length; j++) {
				delete model.incomeStatementData[paramaterArray[i]][j][keyName];
			}
		}
	}

	/**
	* Redirect method to cash flow
	*/
	redirectMethod() {
		this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_CASH_FLOW_PAGE_REDIRECT_URL]
			.replace('{projectId}', this.projectID));
		this._message.showLoader(false);
	}

	cancelButtonClick() {
		// this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_BALANCE_SHEET_PAGE_REDIRECT_URL]
		// .replace('{projectId}', this.projectID));
		this.deletedCustomParameters = [];
		this.redirectUrlOnCancel();
		this._message.showLoader(false);
	}

	/**
	 * Method to re-direct the page to respective page based on the previous url
	 */
	redirectUrlOnCancel() {
		const urlString = this.previousURL;
		if (urlString !== undefined && urlString !== null && urlString !== '' && urlString.indexOf('summary') > -1) {
			this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_SUMMARY_PAGE_REDIRECT_URL]
				.replace('{projectId}', this.projectID));
		} else {
			this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_BALANCE_SHEET_PAGE_REDIRECT_URL]
				.replace('{projectId}', this.projectID));
		}

	}

	/**
	* Total calculation with one model list
	* Total Form Group name
	* Timeline value
	* Model data list
	*/
	getDataTotal(timeline: string, modelList: any) {
		let value = 0;
		for (let i = 0; i < modelList.length; i++) {
			const model = modelList[i].value;
			const data = model.data.filter(obj => obj.timeLine === timeline);
			if (data !== null && data[0].value !== '') {
				if (model.incomeParamType === 'INCOME') {
					value = value + parseFloat(data[0].value);
				} else if (model.incomeParamType === 'EXPENSE') {
					value = value - parseFloat(data[0].value);
				}
			}
		}
		return value;
	}

	//  /**
	//  * Total calculation with two model list
	//  * Total Form Group name
	//  * Timeline value
	//  * Model data list first
	//  * Model data with parameters list
	// */
	//  getFinalTotal(totalFormGroup: FormGroup, timeline: string, modelList1: any, modelList2: any) {
	//    let value = 0;
	//    for (let i = 0; i < modelList1.length; i++) {
	//      let model1 = modelList1[i].value;
	//      if (model1.timeLine === timeline && model1.value !== '') {
	//        value = model1.value;
	//      }
	//    }

	//    for (let j = 0; j < modelList2.length; j++) {
	//      let model2 = modelList2[j].value;
	//      let data2 = model2.data.filter(obj => obj.timeLine === timeline);
	//      if (data2 != null && data2[0].value != '') {
	//        if (model2.incomeParamType === 'INCOME') {
	//          value = value + parseFloat(data2[0].value);
	//        } else if (model2.incomeParamType === 'EXPENSE') {
	//          value = value - parseFloat(data2[0].value);
	//        }
	//      }
	//    }

	//    totalFormGroup.controls.value.setValue(value);
	//    return value;
	//  }

	//  /**
	//  * Final Income Statement Total block( Grand total )
	//  * Total Form Group name
	//  * Timeline value
	//  * Model data list
	// */
	//  getIncomeStmtGrandTotal(totalFormGroup: FormGroup, timeline: string, modelList: any) {
	//    let value = 0;
	//    for (let i = 0; i < modelList.length; i++) {
	//      let model = modelList[i].value;
	//      if (model.timeLine === timeline && model.value !== '') {
	//        value = model.value;
	//      }
	//    }

	//    totalFormGroup.controls.value.setValue(value);
	//    return value;
	//  }

	/**
	 * Method to get Form Group e.g grossProfit for a particular Timeline
	 * @param formArrayControls
	 * @param timeLine
	 */
	getFormGroupByTimeLine(formArrayName: string, timeLine: string): FormGroup {
		const formArrayControls = (<FormArray>this.financialStatementForm
			.get('incomeStatementData').get(formArrayName)).controls;
		if (formArrayControls !== null && formArrayControls !== undefined) {
			for (let i = 0; i < formArrayControls.length; i++) {
				const totalFormGroup = <FormGroup>formArrayControls[i];
				if (timeLine === totalFormGroup.get('timeLine').value) {
					return totalFormGroup;
				}
			}
		}
	}

	/**
	 * Update Total Values of Income Statement
	 * @param currTotalArrayName
	 * @param timeLine
	 */
	updateIncomeStatementTotal(timeLine: string, valueControl: FormControl) {
		this.draftFinanceStatement();
		const value = valueControl.value;
		if (value === null) {
			valueControl.setValue(0);
		} else {
			const roundOfValue = Math.round(parseFloat(value) * 100) / 100;
			valueControl.setValue(roundOfValue);
		}

		// Update Gross Profit Value
		const grossProfitFormGroup = this.getFormGroupByTimeLine('grossProfit', timeLine);
		const grossProfitParamsArray = this.getParameterDataFormArray('grossProfitParams');
		let grossProfitTotalValue = 0;
		if (grossProfitFormGroup !== null && grossProfitFormGroup !== undefined) {
			grossProfitTotalValue = this.getDataTotal(timeLine, grossProfitParamsArray);
			const roundOfGrossProfitTotalValue = Math.round(grossProfitTotalValue * 100) / 100;
			grossProfitFormGroup.controls.value.setValue(roundOfGrossProfitTotalValue);
		}

		// Update Operating Profit
		const opProfitGroup = this.getFormGroupByTimeLine('opProfit', timeLine);
		const opProfitParamsArray = this.getParameterDataFormArray('opProfitParams');
		let opProfitTotalValue = 0;
		if (opProfitGroup !== null && opProfitGroup !== undefined) {
			opProfitTotalValue = this.getDataTotal(timeLine, opProfitParamsArray) + grossProfitTotalValue;
			const roundOfOpProfitTotalValue = Math.round(opProfitTotalValue * 100) / 100;
			opProfitGroup.controls.value.setValue(roundOfOpProfitTotalValue);
		}

		// Update Profit Before Tax
		const profitBeforeTaxGroup = this.getFormGroupByTimeLine('profitBeforeTax', timeLine);
		const profitBeforeTaxParamsArray = this.getParameterDataFormArray('profitBeforeTaxParams');
		let profitBeforeTaxValue = 0;
		if (profitBeforeTaxGroup !== null && profitBeforeTaxGroup !== undefined) {
			profitBeforeTaxValue = this.getDataTotal(timeLine, profitBeforeTaxParamsArray) + opProfitTotalValue;
			const roundOfProfitBeforeTaxValue = Math.round(profitBeforeTaxValue * 100) / 100;
			profitBeforeTaxGroup.controls.value.setValue(roundOfProfitBeforeTaxValue);
		}

		// Update Income Loss
		const incomeLossContGroup = this.getFormGroupByTimeLine('incomeLossCont', timeLine);
		const incomeLossContParamsArray = this.getParameterDataFormArray('incomeLossContParams');
		let incomeLossContValue = 0;
		if (incomeLossContGroup !== null && incomeLossContGroup !== undefined) {
			incomeLossContValue = this.getDataTotal(timeLine, incomeLossContParamsArray) + profitBeforeTaxValue;
			const roundOfIncomeLossContValue = Math.round(incomeLossContValue * 100) / 100;
			incomeLossContGroup.controls.value.setValue(roundOfIncomeLossContValue);
		}

		// Update Compensation Income
		const compIncomeGroup = this.getFormGroupByTimeLine('compIncomeLoss', timeLine);
		const compIncomeParamsArray = this.getParameterDataFormArray('compIncomeParams');
		let compIncomeValue = 0;
		if (compIncomeGroup !== null && compIncomeGroup !== undefined) {
			compIncomeValue = this.getDataTotal(timeLine, compIncomeParamsArray) + incomeLossContValue;
			const roundOfCompIncomeValue = Math.round(compIncomeValue * 100) / 100;
			compIncomeGroup.controls.value.setValue(roundOfCompIncomeValue);
		}

		// Update Total Income
		const totalIncomeGroup = this.getFormGroupByTimeLine('totalIncome', timeLine);
		if (totalIncomeGroup !== null && totalIncomeGroup !== undefined) {
			const roundOfCompIncomeValue = Math.round(compIncomeValue * 100) / 100;
			totalIncomeGroup.controls.value.setValue(roundOfCompIncomeValue);
		}
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
	* Method to navigate back to FA list
	*/
	navigateToFAList() {
		this._router.navigateByUrl(MenuPaths.LIST_FINANCE_ANALYZER_PATH);
	}

	/**
	   * unsubscribe the observable for client change
	   */
	ngOnDestroy() {
		if (this.clientSelectionSubscription !== undefined) {
			this.clientSelectionSubscription.unsubscribe();
		}
	}

	/**
	* Resize the Financial statement data table to view the horizontal scrollbar
	*/
	resizetheTable() {
		if (document.getElementById('cync_main_contents_wradio-list')) {
			const getContainerSize = document.getElementById('cync_main_contents_wradio-list').style.height;
			this.finStatementDataTableHeight = parseInt(getContainerSize) - 13;
		}
	}

	/**
	* Method to update total value while deleting custom field
	* @param dataObject
	* @param parentControl
	*/
	updateDeletedCustomFieldTotalValue(dataObject: any, parentControl: string) {
		const deletedCustomFieldDataArray = dataObject.data;
		for (let i = 0; i < deletedCustomFieldDataArray.length; i++) {
			let updatedOpProfitTotal;
			let updatedProfitBeforeTaxTotal;
			let updatedIncomeLossContTotal;
			let updatedCompIncomeLossTotal;
			let updatedTotalIncome;
			const opProfitTotalFormGroup = this.getFormGroupByTimeLine('opProfit', deletedCustomFieldDataArray[i].timeLine);
			const profitBeforeTaxTotalFormGroup = this.getFormGroupByTimeLine('profitBeforeTax', deletedCustomFieldDataArray[i].timeLine);
			const incomeLossContTotalFormGroup = this.getFormGroupByTimeLine('incomeLossCont', deletedCustomFieldDataArray[i].timeLine);
			const compIncomeLossTotalFormGroup = this.getFormGroupByTimeLine('compIncomeLoss', deletedCustomFieldDataArray[i].timeLine);
			const totalIncomeFormGroup = this.getFormGroupByTimeLine('totalIncome', deletedCustomFieldDataArray[i].timeLine);

			switch (parentControl) {
				case 'opProfitParams':
					if (dataObject.incomeParamType === 'INCOME') {
						updatedOpProfitTotal = opProfitTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
						updatedProfitBeforeTaxTotal = profitBeforeTaxTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
						updatedIncomeLossContTotal = incomeLossContTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
						updatedCompIncomeLossTotal = compIncomeLossTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
						updatedTotalIncome = totalIncomeFormGroup.value.value - deletedCustomFieldDataArray[i].value;
					} else if (dataObject.incomeParamType === 'EXPENSE') {
						updatedOpProfitTotal = opProfitTotalFormGroup.value.value + deletedCustomFieldDataArray[i].value;
						updatedProfitBeforeTaxTotal = profitBeforeTaxTotalFormGroup.value.value + deletedCustomFieldDataArray[i].value;
						updatedIncomeLossContTotal = incomeLossContTotalFormGroup.value.value + deletedCustomFieldDataArray[i].value;
						updatedCompIncomeLossTotal = compIncomeLossTotalFormGroup.value.value + deletedCustomFieldDataArray[i].value;
						updatedTotalIncome = totalIncomeFormGroup.value.value + deletedCustomFieldDataArray[i].value;
					}
					opProfitTotalFormGroup.controls.value.setValue(Math.round(updatedOpProfitTotal * 100) / 100);
					profitBeforeTaxTotalFormGroup.controls.value.setValue(Math.round(updatedProfitBeforeTaxTotal * 100) / 100);
					incomeLossContTotalFormGroup.controls.value.setValue(Math.round(updatedIncomeLossContTotal * 100) / 100);
					compIncomeLossTotalFormGroup.controls.value.setValue(Math.round(updatedCompIncomeLossTotal * 100) / 100);
					totalIncomeFormGroup.controls.value.setValue(Math.round(updatedTotalIncome * 100) / 100);
					break;
				case 'profitBeforeTaxParams':
					if (dataObject.incomeParamType === 'INCOME') {
						updatedProfitBeforeTaxTotal = profitBeforeTaxTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
						updatedIncomeLossContTotal = incomeLossContTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
						updatedCompIncomeLossTotal = compIncomeLossTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
						updatedTotalIncome = totalIncomeFormGroup.value.value - deletedCustomFieldDataArray[i].value;
					} else if (dataObject.incomeParamType === 'EXPENSE') {
						updatedProfitBeforeTaxTotal = profitBeforeTaxTotalFormGroup.value.value + deletedCustomFieldDataArray[i].value;
						updatedIncomeLossContTotal = incomeLossContTotalFormGroup.value.value + deletedCustomFieldDataArray[i].value;
						updatedCompIncomeLossTotal = compIncomeLossTotalFormGroup.value.value + deletedCustomFieldDataArray[i].value;
						updatedTotalIncome = totalIncomeFormGroup.value.value + deletedCustomFieldDataArray[i].value;
					}
					profitBeforeTaxTotalFormGroup.controls.value.setValue(Math.round(updatedProfitBeforeTaxTotal * 100) / 100);
					incomeLossContTotalFormGroup.controls.value.setValue(Math.round(updatedIncomeLossContTotal * 100) / 100);
					compIncomeLossTotalFormGroup.controls.value.setValue(Math.round(updatedCompIncomeLossTotal * 100) / 100);
					totalIncomeFormGroup.controls.value.setValue(Math.round(updatedTotalIncome * 100) / 100);
					break;
				case 'compIncomeParams':
					if (dataObject.incomeParamType === 'INCOME') {
						updatedCompIncomeLossTotal = compIncomeLossTotalFormGroup.value.value - deletedCustomFieldDataArray[i].value;
						updatedTotalIncome = totalIncomeFormGroup.value.value - deletedCustomFieldDataArray[i].value;
					} else if (dataObject.incomeParamType === 'EXPENSE') {
						updatedCompIncomeLossTotal = compIncomeLossTotalFormGroup.value.value + deletedCustomFieldDataArray[i].value;
						updatedTotalIncome = totalIncomeFormGroup.value.value + deletedCustomFieldDataArray[i].value;
					}
					compIncomeLossTotalFormGroup.controls.value.setValue(Math.round(updatedCompIncomeLossTotal * 100) / 100);
					totalIncomeFormGroup.controls.value.setValue(Math.round(updatedTotalIncome * 100) / 100);
					break;
			}
		}
	}

	/**
	 * method to create draft version of financial statement
	 */
	draftFinanceStatement() {
		const model = this.financialStatementForm.getRawValue();
		this.deleteExtraCustomField(model, 'newcustomfield');
		model.financeStatementType = 'BALANCE_STATEMENT';
		let requestBody = new FinancialStatementModel();
		requestBody = model;
		this._commonApiHelper.draftFinancialStmt(this._apiMapper.endpoints[CyncConstants.DRAFT_FINANCE_STMT]
			.replace('{projectId}', this.projectID), requestBody).subscribe(res => {
				// console.log('drafted ', res.status === 201);
			});

	}
}
