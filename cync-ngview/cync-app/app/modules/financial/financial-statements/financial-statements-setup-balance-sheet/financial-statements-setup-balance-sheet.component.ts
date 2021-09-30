import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { Helper } from '@cyncCommon/utils/helper';
import { ActivatedRoute, Router, RoutesRecognized, NavigationStart, NavigationEnd } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import { FormValidationService } from '@cyncCommon/cync-form-validator/form-validation.service';
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';
import { FinancialStatementsService } from '../services/financial-statements.service';
import { FinancialStatementModel, ParameterDataModel, TimelineValuesModel } from '../models/financial-statements.model';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { Subscription } from 'rxjs/Subscription';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';

@Component({
	selector: 'app-financial-statements-setup-balance-sheet',
	templateUrl: './financial-statements-setup-balance-sheet.component.html',
	styleUrls: ['./financial-statements-setup-balance-sheet.component.scss']
})
export class FinancialStatementsSetupBalanceSheetComponent implements OnInit, OnDestroy, DoCheck {

	currentActionBtnText: string = CyncConstants.SAVE_AND_GO_TO_NEXT_BTN_TEXT; // default show next page label;
	backBtnText: string = CyncConstants.ADD_EDIT_PAGE_BACK_BTN_TEXT; // button text for cancel button
	financialStatementForm: FormGroup;
	financialStatementAPIResponse: any;
	isFormLoaded = false;
	headerText = CyncConstants.HEADER_TEXT;
	projectID = CyncConstants.getprojetID();
	selectedRadioBtn = 'finanical_statements';
	public previousURL: any;
	enableFinanceStatementComplete = false;
	enableFinanceRatioComplete = false;
	projectName = '';
	assetsPath: string = CyncConstants.getAssetsPath();
	clientSelectionSubscription: Subscription;
	timeLineList = 0;
	finStatementDataTableHeight: any;
	isFullScreen = false;

	// Adding more rows fields
	deletedCustomParameters: Array<any> = [];

	constructor(
		private _message: MessageServices,
		private _router: Router,
		private _apiMapper: APIMapper,
		private _helper: Helper,
		private fb: FormBuilder,
		private route: ActivatedRoute,
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
		this.previousURL = CyncConstants.getPreviousURL();
		this._message.showLoader(true);
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
	* Add new Custom Field
	*/
	addCustomField(parentControl: string, subControl: string, childControl: string) {
		let currentDataControl;
		if (parentControl === 'assets') {
			currentDataControl = <FormArray>(<FormGroup>(<FormGroup>this.financialStatementForm.controls.balanceSheetData)
				.controls[parentControl]).controls[subControl];
		} else if (parentControl === 'equityAndLiabilities') {
			currentDataControl = <FormArray>(<FormArray>(<FormGroup>(<FormGroup>this.financialStatementForm.controls.balanceSheetData)
				.controls[parentControl]).controls[subControl]).controls[childControl];
		}
		const addParamsCtrl = this.initializeParameterData();
		addParamsCtrl.controls.newcustomfield.setValue(true);
		addParamsCtrl.controls.customParameter.setValue(true);
		for (let i = 0; i < this.financialStatementAPIResponse.timeLinesList.length; i++) {
			const dataControl = <FormArray>(addParamsCtrl.controls.data);
			const dataFormControl = this.initializeData();
			dataFormControl.controls.timeLine.setValue(this.financialStatementAPIResponse.timeLinesList[i]);
			dataFormControl.controls.value.setValue(0);
			dataControl.push(dataFormControl);
		}
		// currentDataControl.push(addParamsCtrl);	 // Add custom field end of form
		currentDataControl.insert(0, addParamsCtrl); // Add custom field in first position
	}

	/**
	* Delete Custom Field
	*/
	deleteCustomField(index: number, parentControl: string, subControl: string, childControl: string, paramsFormArray: FormGroup) {
		this._message.showLoader(true);
		const deletedCustomFieldDataArray = paramsFormArray.controls.data.value;
		for (let i = 0; i < deletedCustomFieldDataArray.length; i++) {
			this.updateDeletedCustomFieldTotalValue(deletedCustomFieldDataArray[i], parentControl, subControl, childControl);
		}
		const isNewCustomField = paramsFormArray.get('newcustomfield').value;
		if (parentControl === 'assets') {
			(<FormArray>(<FormGroup>(<FormGroup>this.financialStatementForm.controls.balanceSheetData).controls[parentControl])
				.controls[subControl]).removeAt(index);
		} else if (parentControl === 'equityAndLiabilities') {
			(<FormArray>(<FormArray>(<FormGroup>(<FormGroup>this.financialStatementForm.controls.balanceSheetData).controls[parentControl])
				.controls[subControl]).controls[childControl]).removeAt(index);
		}

		// Deleting existing custom field
		if (!isNewCustomField) {
			const customParamID = paramsFormArray.get('id').value;
			this.deletedCustomParameters.push(customParamID);
		}
		// this.draftFinanceStatement();
		this._message.showLoader(false);
	}

	/**
	* Update Custom Field Parameter Value while on key press.
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
		const assetsKeysArray = ['currentData', 'nonCurrentData'];
		const liabilityKeysArray = ['currentData', 'nonCurrentData'];
		const equityKeysArray = ['equityData'];
		// Duplicate key validation for Assets.
		for (let i = 0; i < assetsKeysArray.length; i++) {
			for (let j = 0; j < model.balanceSheetData.assets[assetsKeysArray[i]].length; j++) {
				if ((model.balanceSheetData.assets[assetsKeysArray[i]][j].parameter.trim()).toLowerCase() === keyNameLowerCase) {
					duplicateCount++;
				}
			}
		}

		// Duplicate key validation for liability.
		for (let k = 0; k < liabilityKeysArray.length; k++) {
			for (let l = 0; l < model.balanceSheetData.equityAndLiabilities.liabilities[liabilityKeysArray[k]].length; l++) {
				if ((model.balanceSheetData.equityAndLiabilities.liabilities[liabilityKeysArray[k]][l].parameter.trim())
					.toLowerCase() === keyNameLowerCase) {
					duplicateCount++;
				}
			}
		}

		// Duplicate key validation for Equity.
		for (let m = 0; m < equityKeysArray.length; m++) {
			for (let n = 0; n < model.balanceSheetData.equityAndLiabilities.equity[equityKeysArray[m]].length; n++) {
				if ((model.balanceSheetData.equityAndLiabilities.equity[equityKeysArray[m]][n].parameter.trim()).toLowerCase() === keyNameLowerCase) {
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
	* Ng Do Check
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
			'balanceSheetData': this.fb.group({
				'assets': this.fb.group({
					'nonCurrentData': this.fb.array([]),
					'totalNonCurrent': this.fb.array([]),
					'currentData': this.fb.array([]),
					'totalCurrent': this.fb.array([]),
					'total': this.fb.array([])
				}),
				'equityAndLiabilities': this.fb.group({
					'liabilities': this.fb.group({
						'nonCurrentData': this.fb.array([]),
						'totalNonCurrent': this.fb.array([]),
						'currentData': this.fb.array([]),
						'totalCurrent': this.fb.array([]),
						'total': this.fb.array([])
					}),
					'equity': this.fb.group({
						'equityData': this.fb.array([]),
						'totalEquity': this.fb.array([])
					}),
					'total': this.fb.array([])
				}),
			}),
			'incomeStatementData': new FormControl(),
			'cashFlowData': new FormControl(),
			'deletedCustomParameters': new FormControl(),
			'validateFinStmt': new FormControl({ value: false }, Validators.compose([]))
		});
	}

	/**
	* Initialize Parameter Data
	*/
	initializeParameterData() {
		return this.fb.group({
			'parameter': new FormControl('', Validators.compose([Validators.required])),
			'data': this.fb.array([]),
			'customParameter': new FormControl(),
			'id': new FormControl(),
			'newcustomfield': new FormControl({ value: false, disabled: true }, Validators.compose([])),
			'uniqueId': new FormControl()
		});
	}

	/**
	* Initialize Data
	*/
	initializeData() {
		return this.fb.group({
			'timeLine': new FormControl(),
			'value': new FormControl()
		});
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

	/**
	  * Initialize Financial statements
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

		this._financialStatementsService.getFinancialStatements(
			this._apiMapper.endpoints[CyncConstants.GET_FINANCIAL_STATEMENT_PROJECT_DATA].replace('{projectId}', this.projectID))
			.subscribe(res => {
				this.financialStatementAPIResponse = res;
				this.timeLineList = res.timeLinesList.length;
				this.financialStatementForm.patchValue(res);

				/**
				* Assets Form Group
				*/
				const assetsFormGroup: FormGroup = <FormGroup>(<FormGroup>this.financialStatementForm.controls.balanceSheetData).controls.assets;
				this.patchParameterData(<FormArray>assetsFormGroup.controls.nonCurrentData, res.balanceSheetData.assets.nonCurrentData);
				this.patchParameterData(<FormArray>assetsFormGroup.controls.currentData, res.balanceSheetData.assets.currentData);
				this.patchData(<FormArray>assetsFormGroup.controls.totalNonCurrent, res.balanceSheetData.assets.totalNonCurrent);
				this.patchData(<FormArray>assetsFormGroup.controls.totalCurrent, res.balanceSheetData.assets.totalCurrent);
				this.patchData(<FormArray>assetsFormGroup.controls.total, res.balanceSheetData.assets.total);

				/**
				* Equity and Liablilities Form Group
				*/
				const liabilitiesFormGroup: FormGroup = <FormGroup>(<FormGroup>(<FormGroup>
					this.financialStatementForm.controls.balanceSheetData).controls.equityAndLiabilities).controls.liabilities;
				const equityFormGroup: FormGroup = <FormGroup>(<FormGroup>(<FormGroup>
					this.financialStatementForm.controls.balanceSheetData).controls.equityAndLiabilities).controls.equity;
				const equityLiabilitiesTotalFormGroup: FormGroup = <FormGroup>(<FormGroup>
					this.financialStatementForm.controls.balanceSheetData).controls.equityAndLiabilities;

				/**
				* Equity Form Patch
				*/
				this.patchParameterData(<FormArray>liabilitiesFormGroup.controls.nonCurrentData,
					res.balanceSheetData.equityAndLiabilities.liabilities.nonCurrentData);
				this.patchParameterData(<FormArray>liabilitiesFormGroup.controls.currentData,
					res.balanceSheetData.equityAndLiabilities.liabilities.currentData);
				this.patchData(<FormArray>liabilitiesFormGroup.controls.totalNonCurrent,
					res.balanceSheetData.equityAndLiabilities.liabilities.totalNonCurrent);
				this.patchData(<FormArray>liabilitiesFormGroup.controls.totalCurrent,
					res.balanceSheetData.equityAndLiabilities.liabilities.totalCurrent);
				this.patchData(<FormArray>liabilitiesFormGroup.controls.total, res.balanceSheetData.equityAndLiabilities.liabilities.total);

				/**
				* Liabilities Form Patch
				*/
				this.patchParameterData(<FormArray>equityFormGroup.controls.equityData, res.balanceSheetData.equityAndLiabilities.equity.equityData);
				this.patchData(<FormArray>equityFormGroup.controls.totalEquity, res.balanceSheetData.equityAndLiabilities.equity.totalEquity);

				/**
				* Equity and Liabilities Total Form Patch
				*/
				this.patchData(<FormArray>equityLiabilitiesTotalFormGroup.controls.total, res.balanceSheetData.equityAndLiabilities.total);
				this.isFormLoaded = true;
				this._message.showLoader(false);

			});
	}

	/**
	  * Patch Parameter Data Object
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
	  * Patch Data Object
	  */
	patchData(dataFormArray: FormArray, dataList: any[]) {
		for (let j = 0; j < dataList.length; j++) {
			const data = dataList[j];
			const dataGroup = this.initializeData();
			dataGroup.patchValue(data);
			dataFormArray.push(dataGroup);
		}
	}

	/**
	  * Save balance sheet data
	  */
	saveBalanceSheet(model: FinancialStatementModel) {

		this._message.showLoader(true);
		this.deleteExtraCustomField(model, 'newcustomfield');
		model.financeStatementType = 'BALANCE_STATEMENT';
		model.deletedCustomParameters = this.deletedCustomParameters;
		let requestBody = new FinancialStatementModel();
		requestBody = model;
		if (this.financialStatementAPIResponse.id !== null) {
			this._financialStatementsService.updateFinancialStatements(
				this._apiMapper.endpoints[CyncConstants.UPDATE_FINANCIAL_STATEMENT_PROJECT_DATA].replace('{projectId}', this.projectID),
				requestBody).subscribe(responseData => {
					this._helper.showApiMessages(CyncConstants.FINANCIAL_STATEMENT_BALANCE_SHEET_UPDATE_SUCCESS_MSG, CyncConstants.SUCCESS_CSS);
					// this.redirectPageMethod('update');
					this.deletedCustomParameters = [];
					this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_INCOME_STATEMENT_PAGE_REDIRECT_URL]
						.replace('{projectId}', this.projectID));
				});
		} else {
			this._financialStatementsService.saveFinancialStatements(
				this._apiMapper.endpoints[CyncConstants.SAVE_FINANCIAL_STATEMENT_PROJECT_DATA], requestBody).subscribe(responseData => {
					this._helper.showApiMessages(CyncConstants.FINANCIAL_STATEMENT_BALANCE_SHEET_SAVE_SUCCESS_MSG, CyncConstants.SUCCESS_CSS);
					// this.redirectPageMethod('save');
					this.deletedCustomParameters = [];
					this._router.navigateByUrl(
						this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_INCOME_STATEMENT_PAGE_REDIRECT_URL]
							.replace('{projectId}', this.projectID));
				});
		}
	}

	/**
	* Delete Extra field according to key name.
	*/
	deleteExtraCustomField(model: FinancialStatementModel, keyName: string) {

		const assetsKeysArray = ['currentData', 'nonCurrentData'];
		const liabilityKeysArray = ['currentData', 'nonCurrentData'];
		const equityKeysArray = ['equityData'];
		// Deleting Assets new custom field.
		for (let i = 0; i < assetsKeysArray.length; i++) {
			for (let j = 0; j < model.balanceSheetData.assets[assetsKeysArray[i]].length; j++) {
				delete model.balanceSheetData.assets[assetsKeysArray[i]][j][keyName];
			}
		}

		// Deleting liability new cusom field.
		for (let k = 0; k < liabilityKeysArray.length; k++) {
			for (let l = 0; l < model.balanceSheetData.equityAndLiabilities.liabilities[liabilityKeysArray[k]].length; l++) {
				delete model.balanceSheetData.equityAndLiabilities.liabilities[liabilityKeysArray[k]][l][keyName];
			}
		}

		// Deleting Equity new cusom field.
		for (let m = 0; m < equityKeysArray.length; m++) {
			for (let n = 0; n < model.balanceSheetData.equityAndLiabilities.equity[equityKeysArray[m]].length; n++) {
				delete model.balanceSheetData.equityAndLiabilities.equity[equityKeysArray[m]][n][keyName];
			}
		}
	}

	/**
	  * Cancel button click event
	  */
	cancelButtonClick() {
		this.deletedCustomParameters = [];
		this._message.showLoader(true);
		this.redirectPageMethod('cancel');
	}

	/**
	* Redirect page method according to previous route.
	*/
	redirectPageMethod(actionType: string) {
		const urlString = this.previousURL;
		if (urlString !== undefined && urlString !== null && urlString !== '') {
			if (urlString.indexOf('summary') > -1) {
				this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_SUMMARY_PAGE_REDIRECT_URL]
					.replace('{projectId}', this.projectID));
			} else if (actionType !== 'cancel') {
				this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_INCOME_STATEMENT_PAGE_REDIRECT_URL]
					.replace('{projectId}', this.projectID));
			} else {
				this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_ANALYZER_REDIRECT_URL]);
			}
		} else if (actionType !== 'cancel') {
			this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_INCOME_STATEMENT_PAGE_REDIRECT_URL]
				.replace('{projectId}', this.projectID));
		} else {
			this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_ANALYZER_REDIRECT_URL]);
		}
		this._message.showLoader(false);
	}
	/**
	  * Get parameter data controls for assets
	  */
	getParameterDataFormArray(arrayHeader: string, arrayName: string) {
		return (<FormArray>this.financialStatementForm.get('balanceSheetData').get(arrayHeader).get(arrayName)).controls;
	}

	/**
	  * Get parameter data controls for equity and libilities
	  */
	getEquityLiabilityParameterDataFormArray(arrayHeader: string, arraySubHeader: string, arrayName: string) {
		return (<FormArray>this.financialStatementForm.get('balanceSheetData').get(arrayHeader).get(arraySubHeader).get(arrayName)).controls;
	}

	/**
	  * Get data controls for assets
	  */
	getDataControls(dataForm: FormGroup) {
		return (<FormArray>dataForm.controls.data).controls;
	}

	/**
	* Total formula calculation for input data model
	* Total Form Group name
	* Timeline value
	* Model data list
	  */
	getDataTotal(totalFormGroup: FormGroup, timeline: string, modelList: any) {
		let value = 0;
		for (let i = 0; i < modelList.length; i++) {

			const model = modelList[i].value;
			const data = model.data.filter(obj => obj.timeLine === timeline);
			if (data !== null && data[0].value !== '') {
				value = value + parseFloat(data[0].value);
			}
		}
		const roundOfValue = Math.round(value * 100) / 100;
		totalFormGroup.controls.value.setValue(roundOfValue);
		return value;
	}

	//  /**
	//  * Final Total formula calculation only total data model
	//  * Total Form Group name
	//  * Timeline value
	//  * Model data list first
	//  * Model data list second
	// */
	//  getFinalTotal(totalFormGroup: FormGroup, timeline: string, modelList1: any, modelList2: any) {
	//    let value = 0;
	//    for (let i = 0; i < modelList1.length; i++) {
	//      let model1 = modelList1[i].value;
	//      if (model1.timeLine === timeline && model1.value !== '') {
	//        value = value + parseFloat(model1.value);
	//      }
	//    }
	//    for (let j = 0; j < modelList2.length; j++) {
	//      let model2 = modelList2[j].value;
	//      if (model2.timeLine === timeline && model2.value !== '') {
	//        value = value + parseFloat(model2.value);
	//      }
	//    }
	//    totalFormGroup.controls.value.setValue(value);
	//    return value;
	//  }

	/**
	* Final Total formula calculation only total data model
	* Total Form Group name
	* Timeline value
	* Model data list first
	* Model data list second
	  */
	isBalanceSheetValid(timeLine: string): boolean {
		let isMatched = false;
		const equityAndLiabilitiesFormArray = (<FormArray>this.financialStatementForm
			.get('balanceSheetData').get('equityAndLiabilities').get('total'));
		const totalAssetsFormArray = (<FormArray>this.financialStatementForm
			.get('balanceSheetData').get('assets').get('total'));
		if (equityAndLiabilitiesFormArray !== null
			&& equityAndLiabilitiesFormArray !== undefined && totalAssetsFormArray !== null && totalAssetsFormArray !== undefined) {
			const totalEquityAndLiabilitiesValue = this.getFormGroupByTimeLine(equityAndLiabilitiesFormArray.controls, timeLine)
				.controls.value.value;
			const totalAssetsValue = this.getFormGroupByTimeLine(totalAssetsFormArray.controls, timeLine).controls.value.value;
			// if ((totalEquityAndLiabilitiesValue - totalAssetsValue) === 0) {
			// 	isMatched = true;
			// }
			if ((totalEquityAndLiabilitiesValue === totalAssetsValue) && totalEquityAndLiabilitiesValue > 0 && totalEquityAndLiabilitiesValue > 0) {
				isMatched = true;
			}
		}
		return isMatched;
	}

	/**
	 * Method to get Form Group e.g totalNonCurrent, totalCurrent etc for a particular Timeline
	 * @param formArrayControls
	 * @param timeLine
	 */
	getFormGroupByTimeLine(formArrayControls: AbstractControl[], timeLine: string): FormGroup {
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
	 * Method to update totalNoncurrent, totalCurrent and total assets
	 * @param index
	 * @param timeLine
	 */
	updateAssetsSum(timeLine: string, valueControl: FormControl) {
		this.draftFinanceStatement();
		const value = valueControl.value;
		if (value === null) {
			valueControl.setValue(0);
		} else {
			const roundOfValue = Math.round(parseFloat(value) * 100) / 100;
			valueControl.setValue(roundOfValue);
		}

		// Update Total Non Current Assets
		const totalNonCurrentAssetsFormGroup = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
			.get('balanceSheetData').get('assets').get('totalNonCurrent')).controls, timeLine);
		const totalNonCurrentAssetsDataArray = this.getParameterDataFormArray('assets', 'nonCurrentData');

		let totalNonCurrentAssetsValue = 0;
		if (totalNonCurrentAssetsFormGroup !== null && totalNonCurrentAssetsFormGroup !== undefined) {
			totalNonCurrentAssetsValue = this.getDataTotal(totalNonCurrentAssetsFormGroup, timeLine, totalNonCurrentAssetsDataArray);
		}

		// Update Total Current Assets
		const totalCurrentAssetsFormGroup = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
			.get('balanceSheetData').get('assets').get('totalCurrent')).controls, timeLine);
		const totalCurrentAssetsDataArray = this.getParameterDataFormArray('assets', 'currentData');

		let totalCurrentAssetsValue = 0;
		if (totalCurrentAssetsFormGroup !== null && totalCurrentAssetsFormGroup !== undefined) {
			totalCurrentAssetsValue = this.getDataTotal(totalCurrentAssetsFormGroup, timeLine, totalCurrentAssetsDataArray);
		}

		// Update Total Assets
		const totalAssetsForGroup = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
			.get('balanceSheetData').get('assets').get('total')).controls, timeLine);
		const totalAssetsValue = totalNonCurrentAssetsValue + totalCurrentAssetsValue;
		const roundOfTotalAssetsValue = Math.round(totalAssetsValue * 100) / 100;
		totalAssetsForGroup.controls.value.setValue(roundOfTotalAssetsValue);
	}

	/**
	 * Method to update Total Liabilities
	 * @param timeLine
	 */
	updateLiabilitiesSum(timeLine: string, valueControl: FormControl) {
		this.draftFinanceStatement();
		const value = valueControl.value;
		if (value === null) {
			valueControl.setValue(0);
		} else {
			const roundOfValue = Math.round(parseFloat(value) * 100) / 100;
			valueControl.setValue(roundOfValue);
		}

		// Update Total Non Current Liabilities
		const totalNonCurrentLiabilitiesFormGroup = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
			.get('balanceSheetData').get('equityAndLiabilities').get('liabilities').get('totalNonCurrent')).controls, timeLine);
		const totalNonCurrentLiabilitiesDataArray = this.getEquityLiabilityParameterDataFormArray('equityAndLiabilities',
			'liabilities', 'nonCurrentData');
		let totalNonCurrentLiabilitiesValue = 0;
		if (totalNonCurrentLiabilitiesFormGroup !== null && totalNonCurrentLiabilitiesFormGroup !== undefined) {
			totalNonCurrentLiabilitiesValue = this.getDataTotal(totalNonCurrentLiabilitiesFormGroup, timeLine, totalNonCurrentLiabilitiesDataArray);
		}

		// Update Total Current Liabilities
		const totalCurrentLiabilitiesFormGroup = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
			.get('balanceSheetData').get('equityAndLiabilities').get('liabilities').get('totalCurrent')).controls, timeLine);
		const totalCurrentLiabilitiesDataArray = this.getEquityLiabilityParameterDataFormArray('equityAndLiabilities',
			'liabilities', 'currentData');
		let totalCurrentLiabilitiesValue = 0;
		if (totalCurrentLiabilitiesFormGroup !== null && totalCurrentLiabilitiesFormGroup !== undefined) {
			totalCurrentLiabilitiesValue = this.getDataTotal(totalCurrentLiabilitiesFormGroup, timeLine, totalCurrentLiabilitiesDataArray);
		}

		// Update Total Liabilities
		const totalLiabilitiesForGroup = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
			.get('balanceSheetData').get('equityAndLiabilities').get('liabilities').get('total')).controls, timeLine);
		const totalLiabilitiesValue = totalNonCurrentLiabilitiesValue + totalCurrentLiabilitiesValue;
		const roundOfTotalLiabilitiesValue = Math.round(totalLiabilitiesValue * 100) / 100;
		totalLiabilitiesForGroup.controls.value.setValue(roundOfTotalLiabilitiesValue);

		const totalEquityValue = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
			.get('balanceSheetData').get('equityAndLiabilities').get('equity').get('totalEquity')).controls, timeLine).controls.value.value;

		// Update equity and liabilities total
		const totalEquityAndLiabilitiesGroup = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
			.get('balanceSheetData').get('equityAndLiabilities').get('total')).controls, timeLine);
		const totalEquityAndLiabilitiesValue = totalEquityValue + totalLiabilitiesValue;
		const roundOfTotalEquityAndLiabilitiesValue = Math.round(parseFloat(totalEquityAndLiabilitiesValue) * 100) / 100;
		totalEquityAndLiabilitiesGroup.controls.value.setValue(roundOfTotalEquityAndLiabilitiesValue);

	}

	/**
	 * Method to Update total Equity
	 * @param timeLine
	 */
	updateEquitySum(timeLine: string, valueControl: FormControl) {
		this.draftFinanceStatement();
		const value = valueControl.value;
		if (value === null) {
			valueControl.setValue(0);
		} else {
			const roundOfValue = Math.round(parseFloat(value) * 100) / 100;
			valueControl.setValue(roundOfValue);
		}

		// Update Total Equity Sum
		const totalEquityGroup = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
			.get('balanceSheetData').get('equityAndLiabilities').get('equity').get('totalEquity')).controls, timeLine);
		const totalEquityDataArray = this.getEquityLiabilityParameterDataFormArray('equityAndLiabilities', 'equity', 'equityData');
		let totalEquityValue = 0;
		if (totalEquityGroup !== null && totalEquityGroup !== undefined) {
			totalEquityValue = this.getDataTotal(totalEquityGroup, timeLine, totalEquityDataArray);
		}

		// Update equity and liabilities total
		const totalLiabilitiesValue = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
			.get('balanceSheetData').get('equityAndLiabilities').get('liabilities').get('total')).controls, timeLine).controls.value.value;
		const totalEquityAndLiabilitiesGroup = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
			.get('balanceSheetData').get('equityAndLiabilities').get('total')).controls, timeLine);
		const totalEquityAndLiabilitiesValue = totalEquityValue + totalLiabilitiesValue;
		const roundOfTotalEquityAndLiabilitiesValue = Math.round(parseFloat(totalEquityAndLiabilitiesValue) * 100) / 100;
		totalEquityAndLiabilitiesGroup.controls.value.setValue(roundOfTotalEquityAndLiabilitiesValue);

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
	 * @param index
	 * @param timeLine
	 */
	updateDeletedCustomFieldTotalValue(dataObject: any, parentControl: string, subControl: string, childControl: string) {
		let parentFormGroup;
		let totalFormGroup;
		let equityAndLiabilityTotalFormGroup;
		let updatedParentTotalValue;
		let updatedTotalValue;
		let updatedEquityLiabilitiesFinalTotalValue;

		if (parentControl === 'assets') {
			if (subControl === 'currentData') {
				parentFormGroup = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
					.get('balanceSheetData').get('assets').get('totalCurrent')).controls, dataObject['timeLine']);
			} else if (subControl === 'nonCurrentData') {
				parentFormGroup = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
					.get('balanceSheetData').get('assets').get('totalNonCurrent')).controls, dataObject['timeLine']);
			}
			totalFormGroup = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
				.get('balanceSheetData').get('assets').get('total')).controls, dataObject['timeLine']);
		} else if (parentControl === 'equityAndLiabilities') {
			if (subControl === 'liabilities') {
				if (childControl === 'currentData') {
					parentFormGroup = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
						.get('balanceSheetData').get('equityAndLiabilities').get('liabilities').get('totalCurrent')).controls, dataObject['timeLine']);
				} else if (childControl === 'nonCurrentData') {
					parentFormGroup = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
						.get('balanceSheetData').get('equityAndLiabilities').get('liabilities').get('totalNonCurrent')).controls, dataObject['timeLine']);
				}
				totalFormGroup = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
					.get('balanceSheetData').get('equityAndLiabilities').get('liabilities').get('total')).controls, dataObject['timeLine']);
			} else if (subControl === 'equity') {
				if (childControl === 'equityData') {
					parentFormGroup = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
						.get('balanceSheetData').get('equityAndLiabilities').get('equity').get('totalEquity')).controls, dataObject['timeLine']);
				}
			}
			equityAndLiabilityTotalFormGroup = this.getFormGroupByTimeLine((<FormArray>this.financialStatementForm
				.get('balanceSheetData').get('equityAndLiabilities').get('total')).controls, dataObject['timeLine']);
		}

		// Total value update
		if (parentControl === 'assets') {
			updatedParentTotalValue = parentFormGroup.value.value - dataObject['value'];
			updatedTotalValue = totalFormGroup.value.value - dataObject['value'];
			parentFormGroup.controls.value.setValue(Math.round(updatedParentTotalValue * 100) / 100);
			totalFormGroup.controls.value.setValue(Math.round(updatedTotalValue * 100) / 100);
		} else if (parentControl === 'equityAndLiabilities') {
			if (subControl === 'liabilities') {
				updatedParentTotalValue = parentFormGroup.value.value - dataObject['value'];
				updatedTotalValue = totalFormGroup.value.value - dataObject['value'];
				updatedEquityLiabilitiesFinalTotalValue = equityAndLiabilityTotalFormGroup.value.value - dataObject['value'];
				parentFormGroup.controls.value.setValue(Math.round(updatedParentTotalValue * 100) / 100);
				totalFormGroup.controls.value.setValue(Math.round(updatedTotalValue * 100) / 100);
				equityAndLiabilityTotalFormGroup.controls.value.setValue(Math.round(updatedEquityLiabilitiesFinalTotalValue * 100) / 100);
			} else if (subControl === 'equity') {
				updatedParentTotalValue = parentFormGroup.value.value - dataObject['value'];
				updatedEquityLiabilitiesFinalTotalValue = equityAndLiabilityTotalFormGroup.value.value - dataObject['value'];
				parentFormGroup.controls.value.setValue(Math.round(updatedParentTotalValue * 100) / 100);
				equityAndLiabilityTotalFormGroup.controls.value.setValue(Math.round(updatedEquityLiabilitiesFinalTotalValue * 100) / 100);
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
